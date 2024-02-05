 
def SM_FUNCTION_post_tagger_imp(content, parameters) -> dict:
    
    if 'job' in content:
        tags = parameters["options"]
    else:
        tags = []
        
    return {"tags": tags }
    