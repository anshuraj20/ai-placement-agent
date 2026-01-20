import backend.app.core.config  # ensures .env is loaded

from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel

print("✅ OPENAI_API_KEY loaded: True")
print("✅ placement_agent module loaded")

# ---------- Output Schema ----------
class PlacementPlan(BaseModel):
    target_role: str
    preparation_roadmap: list[str]
    daily_plan: list[str]
    mock_questions: list[str]

# ---------- Model ----------
model = OpenAIModel(
    model_name="mistralai/mistral-7b-instruct"
)

# ---------- Agent (NO result_type, NO decorators) ----------
placement_agent = Agent(
    model=model,
    system_prompt="""
    You are an expert placement preparation mentor.
    Always respond in VALID JSON with this structure:
    {
      "target_role": "...",
      "preparation_roadmap": [],
      "daily_plan": [],
      "mock_questions": []
    }
    """
)
