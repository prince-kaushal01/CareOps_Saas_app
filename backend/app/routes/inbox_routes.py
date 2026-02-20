from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from supabase import Client #type: ignore
from datetime import datetime
import uuid

from backend.database import get_supabase
from backend.auth import require_staff_or_admin
from backend.schemas import (
    ConversationResponse,
    MessageResponse,
    MessageCreate,
)

router = APIRouter(prefix="/inbox", tags=["Inbox"])


# ---------------------------------------------------------
# GET CONVERSATIONS
# ---------------------------------------------------------

@router.get(
    "/conversations",
    response_model=List[ConversationResponse],
)
async def get_conversations(
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase),
):
    """Get all conversations"""

    try:
        result = (
            supabase.table("conversations")
            .select("*")
            .order("updated_at", desc=True)
            .execute()
        )

        return result.data

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# ---------------------------------------------------------
# GET MESSAGES
# ---------------------------------------------------------

@router.get(
    "/messages/{conversation_id}",
    response_model=List[MessageResponse],
)
async def get_messages(
    conversation_id: str,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase),
):
    """Get messages for a conversation"""

    try:
        result = (
            supabase.table("messages")
            .select("*")
            .eq("conversation_id", conversation_id)
            .order("created_at", desc=False)
            .execute()
        )

        return result.data

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# ---------------------------------------------------------
# SEND MESSAGE
# ---------------------------------------------------------

@router.post(
    "/messages",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
)
async def send_message(
    body: MessageCreate,
    current_user: dict = Depends(require_staff_or_admin),
    supabase: Client = Depends(get_supabase),
):
    """Send a message"""

    try:
        message_data = {
            "id": str(uuid.uuid4()),
            "conversation_id": body.conversation_id,
            "text": body.text,
            "is_me": True,
            "created_at": datetime.utcnow().isoformat(),
        }

        result = (
            supabase.table("messages")
            .insert(message_data)
            .execute()
        )

        # Update conversation last message
        supabase.table("conversations").update(
            {
                "last_message": body.text,
                "updated_at": datetime.utcnow().isoformat(),
            }
        ).eq(
            "id",
            body.conversation_id,
        ).execute()

        return result.data[0]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )
