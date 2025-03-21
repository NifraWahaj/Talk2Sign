from transformers import T5ForConditionalGeneration, T5Tokenizer
import torch

def load_model_and_tokenizer(model_path):
    # Load the tokenizer and model
    tokenizer = T5Tokenizer.from_pretrained(model_path)
    model = T5ForConditionalGeneration.from_pretrained(model_path)
    return tokenizer, model

def generate_asl_gloss(tokenizer, model, input_text, device):
    # Add task prefix
    input_text = f"translate English to ASL: {input_text}"
    
    # Preprocess the input text
    input_ids = tokenizer.encode(input_text, return_tensors="pt").to(device)
    
    # Generate the ASL gloss with improved parameters
    output = model.generate(
        input_ids,
        max_length=64,
        num_beams=4,
        early_stopping=True,
        no_repeat_ngram_size=2,
        repetition_penalty=2.0,
    )
    
    asl_gloss = tokenizer.decode(output[0], skip_special_tokens=True)
    return asl_gloss

if __name__ == "__main__":
    # Path to the directory containing the model files
    model_path = "final_text_to_gloss_model"  # Adjust this path if necessary
    
    # Load the model and tokenizer
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    tokenizer, model = load_model_and_tokenizer(model_path)
    model.to(device)
    
    # Example input text
    input_text = "Hello how are you doing"
    
    # Generate ASL gloss
    asl_gloss = generate_asl_gloss(tokenizer, model, input_text, device)
    
    print("Input Text:", input_text)
    print("ASL Gloss:", asl_gloss)