from typing import Dict, List
from app.db import get_connection

LANGUAGES = [
    "c", "cpp", "csharp", "go", "html",
    "java", "javascript", "kotlin", "python", "typescript"
]

all_code: Dict[str, List[str]] = {
    lang: [] for lang in LANGUAGES
}

def load_snippets():
    sql = """
        SELECT * FROM (
            SELECT *, ROW_NUMBER() OVER(PARTITION BY language ORDER BY RANDOM()) AS r
            FROM snippets
        ) x WHERE x.r <= 10
    """

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(sql)

    rows = cur.fetchall()

    for row in rows:
        language = row[1]   # adjust index if needed
        code = row[2]
        all_code[language].append(code)

    cur.close()
    conn.close()

    print("Snippets loaded into memory")
