# Step 1: Start with official Python 3.13 image (slim = smaller size)
FROM --platform=linux/amd64 python:3.13-slim

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy requirements first (for caching)
COPY requirements.txt .

# Step 4: Install all dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Step 5: Copy all backend files into container
COPY . .

# Step 6: Tell Docker our app runs on port 8000
EXPOSE 8000

# Step 7: Start the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]