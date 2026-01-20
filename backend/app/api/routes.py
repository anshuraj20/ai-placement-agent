from fastapi import APIRouter, HTTPException
from app.schemas import (
    PlacementRequest,
    PlacementResponse,
    RoadmapItem,
    DailyPlanItem,
    MockQuestion,
)
from app.agents.placement_agent import placement_agent
import json

router = APIRouter()

@router.post("/generate-plan", response_model=PlacementResponse)
async def generate_plan(request: PlacementRequest):
    try:
        result = await placement_agent.run(
            f"""
You are an expert placement preparation coach.

Target role: {request.target_role}
Current level: {request.current_level}

STRICT INSTRUCTIONS:
1. Tailor everything ONLY to the given role.
2. Do NOT include skills from other domains.
3. Mock questions must be REAL interview questions.
4. Daily plan must reflect industry-level preparation.
5. Avoid generic or repeated answers.

ROLE-SPECIFIC GUIDELINES:
- Data Analyst → SQL, Excel, Power BI/Tableau, business metrics
- Data Scientist → Python, statistics, ML models, projects
- Full Stack Developer → React, backend APIs, databases, system design
- AI Engineer → LLMs, prompt engineering, AI APIs, RAG
- ML Engineer → model training, pipelines, deployment, MLOps
- DevOps Engineer → Docker, Kubernetes, CI/CD, cloud platforms

OUTPUT RULES:
- Return ONLY valid JSON
- Do NOT include explanations or markdown
- Follow this exact schema:

{{
  "target_role": string,
  "preparation_roadmap": [
    {{ "topic": string, "resources": [string] }}
  ],
  "daily_plan": [
    {{ "time": string, "task": string }}
  ],
  "mock_questions": [
    {{ "question": string, "answer": string }}
  ]
}}
"""
        )

        raw_output = result.output
        print("RAW AGENT OUTPUT ↓↓↓")
        print(raw_output)

        # 1️⃣ Convert string → dict
        if isinstance(raw_output, str):
            raw_output = json.loads(raw_output)

        # 2️⃣ Normalize preparation roadmap
        preparation_roadmap = []
        for item in raw_output.get("preparation_roadmap", []):
            if isinstance(item, str):
                preparation_roadmap.append(
                    RoadmapItem(
                        topic=item,
                        resources=["Self-study", "Online resources"]
                    )
                )
            else:
                preparation_roadmap.append(RoadmapItem(**item))

        # 3️⃣ Normalize daily plan
        time_slots = ["Morning", "Afternoon", "Evening"]
        daily_plan = []

        for i, item in enumerate(raw_output.get("daily_plan", [])):
            if isinstance(item, str):
                daily_plan.append(
                    DailyPlanItem(
                        time=time_slots[i % 3],
                        task=item
                    )
                )
            else:
                daily_plan.append(
                    DailyPlanItem(
                        time=item.get("time", time_slots[i % 3]),
                        task=item.get("task") or item.get("activity", "")
                    )
                )

        # 4️⃣ Normalize mock questions
        mock_questions = [
            MockQuestion(**q)
            for q in raw_output.get("mock_questions", [])
        ]

        # 5️⃣ Return validated response
        return PlacementResponse(
            target_role=raw_output["target_role"],
            preparation_roadmap=preparation_roadmap,
            daily_plan=daily_plan,
            mock_questions=mock_questions,
        )

    except Exception as e:
        print("❌ BACKEND ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))
