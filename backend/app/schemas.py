from pydantic import BaseModel
from typing import List

class PlacementRequest(BaseModel):
    target_role: str
    current_level: str

class RoadmapItem(BaseModel):
    topic: str
    resources: List[str]

class DailyPlanItem(BaseModel):
    time: str
    task: str

class MockQuestion(BaseModel):
    question: str
    answer: str

class PlacementResponse(BaseModel):
    target_role: str
    preparation_roadmap: List[RoadmapItem]
    daily_plan: List[DailyPlanItem]
    mock_questions: List[MockQuestion]
