# main.py
from IPython.display import Image


from core.agentgraph import app

input_data = {
    "question": "Show all product names and current stock levels from the inventory",
    "user_email": "john@example.com",
    "designation": "Software Engineer"
}

print("Input Data:", input_data)
Image(app.get_graph().draw_mermaid_png)
result = app.invoke(input_data)
print("Final Result:", result)
