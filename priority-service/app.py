from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch

app = Flask(__name__)

MODEL_PATH = "./ticket_priority_model"
LABELS = {0: "LOW", 1: "MEDIUM", 2: "HIGH", 3: "CRITICAL"}

tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
model.eval()


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "").strip()
    if not text:
        return jsonify({"error": "text is required"}), 400

    inputs = tokenizer(text, return_tensors="pt", truncation=True,
                       padding="max_length", max_length=128)
    with torch.no_grad():
        logits = model(**inputs).logits
    predicted_class = int(torch.argmax(logits, dim=-1).item())
    confidence = float(torch.softmax(logits, dim=-1).max().item())

    return jsonify({
        "priority": predicted_class,
        "priority_label": LABELS[predicted_class],
        "confidence": round(confidence, 4)
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
