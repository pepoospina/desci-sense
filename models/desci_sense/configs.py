from dataclasses import dataclass
# import pydantic as pyd
from confection import Config

OPENROUTER_API_BASE = "https://openrouter.ai/api/v1"

# Streamlit App URL
ST_OPENROUTER_REFERRER = "https://ai-nanopub.streamlit.app/"

# project to save data from deployed web app
WEB_APP_WANDB_PROJ = "st-app-multi-v1"

# sandbox project
WANDB_SANDBOX_PROJ = "st-demo-sandbox"
    

def init_config(model_name: str = "mistralai/mistral-7b-instruct",
                parser_type: str = "base",
                temperature: float = 0.6,
                template_path: str = "desci_sense/prompting/templates/p4.txt",
                wandb_entity: str = "common-sense-makers",
                wandb_project: str = WANDB_SANDBOX_PROJ
                ):
    config = Config(
                    {
                    "general": {
                        "parser_type": parser_type

                    },

                    "model": {
                            "model_name": model_name, 
                            "temperature": temperature
                        },
                    "prompt": {
                        "template_path": template_path
                    },
                    "wandb": {
                        "entity": wandb_entity,
                        "project": wandb_project
                        
                    },
                    
                    

                    }
                    
                    
                    )
    return config
    

def init_crawler_config(
        

    ):
    pass
