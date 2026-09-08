# Flexbox Game — תחנת חלל 🛰️

משחק לימוד **Flexbox** בעברית. תאי מטען (pods) בתא מעבר של תחנת חלל: בכל שלב
מקבלים משימה, בוחרים ערכים למאפייני Flexbox, ובודקים אם התאים עגנו נכון.

HTML + CSS + JavaScript בלבד — **ללא ספריות חיצוניות וללא CSS Grid** לפתרון
החידות.

## מגישים

| שם | ת״ז |
|---|---|
| _להשלמה_ | _להשלמה_ |
| _להשלמה_ | _להשלמה_ |

## קישור חי

_להשלמה — GitHub Pages_

## הרצה מקומית

אין תהליך בנייה ואין תלויות. אפשר פשוט לפתוח את `index.html` בדפדפן, או להריץ
שרת סטטי כדי להימנע ממגבלות `file://`:

```bash
python3 -m http.server 8000
# ואז http://localhost:8000
```

## מבנה הפרויקט

```
flexbox-game/
├── index.html          # דף יחיד, שלושת המסכים בתוכו
├── css/
│   ├── reset.css       # נורמליזציה קטנה
│   └── style.css       # ערכת נושא, פריסה, לוח, אנימציות, מדיה קוורי
├── js/
│   ├── levels.js       # מערך LEVELS — נתונים בלבד, בלי DOM
│   ├── engine.js       # מצב, ולידציה, ניקוד, localStorage
│   ├── ui.js           # רינדור פקדים, לוח, הודעות, מפת שלבים
│   └── main.js         # אתחול וחיווט אירועים
├── assets/             # SVG של התאים, רקע התחנה
└── docs/
    └── CONTRACT.md     # חוזה הנתונים וה-DOM בין שני המפתחים
```

סדר הטעינה ב-`index.html` הוא `levels.js → engine.js → ui.js → main.js` עם
`defer`. בלי מודולים ובלי bundler — עובד ב-GitHub Pages ללא הגדרות.

## חלוקת עבודה

| | תחום | קבצים |
|---|---|---|
| **Person A** | Front — HTML, CSS, עיצוב | `index.html`, `css/`, `assets/` |
| **Person B** | Logic — JavaScript | `js/` |

כלל שמירה על מיזוגים נקיים: **Person A לא נוגע ב-`js/`, Person B לא נוגע
ב-`css/`.** החוזה המשותף מתועד ב-[`docs/CONTRACT.md`](docs/CONTRACT.md) ומשתנה
רק ב-PR ששני הצדדים מאשרים.

## תהליך העבודה ב-git

`main` מוגן — כל שינוי נכנס דרך branch ו-Pull Request:

- `chore/*` — תשתית ושלד
- `feat/ui-*` — העבודה של Person A
- `feat/logic-*` — העבודה של Person B
