import openai
from backend.config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)

# Initialize OpenAI client
openai.api_key = settings.openai_api_key

class AIService:
    """Service for interacting with OpenAI API"""
    
    @staticmethod
    def get_response(
        message: str,
        model: str = None,
        temperature: float = None,
        max_tokens: int = None
    ) -> tuple[str, int]:
        """Get AI response from OpenAI
        
        Args:
            message: User's question
            model: Model to use (default from settings)
            temperature: Temperature for response creativity
            max_tokens: Maximum tokens in response
            
        Returns:
            Tuple of (response_text, tokens_used)
        """
        try:
            model = model or settings.openai_model
            temperature = temperature if temperature is not None else settings.temperature
            max_tokens = max_tokens or settings.max_tokens
            
            response = openai.ChatCompletion.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful AI assistant that answers questions clearly and concisely. Provide accurate, informative responses."
                    },
                    {
                        "role": "user",
                        "content": message
                    }
                ],
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=settings.top_p
            )
            
            # Extract response
            ai_response = response.choices[0].message.content
            tokens_used = response.usage.total_tokens
            
            logger.info(f"AI Response generated - Model: {model}, Tokens: {tokens_used}")
            return ai_response, tokens_used
            
        except openai.error.RateLimitError:
            logger.error("Rate limit exceeded")
            raise Exception("API rate limit exceeded. Please try again later.")
        except openai.error.AuthenticationError:
            logger.error("Authentication failed")
            raise Exception("Authentication failed. Please check your API key.")
        except Exception as e:
            logger.error(f"Error calling OpenAI API: {str(e)}")
            raise Exception(f"Failed to get AI response: {str(e)}")
