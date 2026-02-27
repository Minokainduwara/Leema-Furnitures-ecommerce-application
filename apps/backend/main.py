from fastapi import FastAPI # type: ignore

app = FastAPI()

@app.get("/")
def root():
    return {"Hello": "World"}