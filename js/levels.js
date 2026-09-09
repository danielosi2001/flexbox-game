// js/levels.js — כל השלבים של המשחק, כל אחד אובייקט נפרד. נתונים
// בלבד: אין כאן DOM ואין לוגיקה. מבנה השדות מתועד ב-docs/CONTRACT.md §1.
//
// שני כללים ש-engine.js מאמת בטעינה: כל מפתח ב-solution חייב להופיע גם
// ב-controls, וכל ערך חייב להיות אחד מהערכים שהפקד מציע. אחרת השלב
// בלתי פתיר.
//
// קיבולת הלוח (חוזה §5): שורה מכילה 6 תאים רגילים, טור מכיל 4. שלב
// שחורג מזה חייב flex-wrap ב-controls, אחרת תאים נופלים מחוץ ל-
// overflow: hidden והשחקן סופר פחות תאים ממה שהובטח. שלב 7 חורג
// בכוונה — החריגה היא השיעור.
//
// #board הוא dir="ltr" (חוזה §2), ולכן flex-start הוא הקצה השמאלי
// ו-flex-end הימני, וכך גם ההוראות מנוסחות.

const LEVELS = [
  {
    id: 1,
    title: "הדלקת הלוח",
    instruction: "הלוח עדיין לא במצב Flex והתאים נערמים זה על זה. הפעילו Flex, והצמידו את שלושת התאים לקצה הימני של הלוח.",
    items: 3,
    itemSizes: null,
    controls: ['display', 'justify-content'],
    solution: {
      'display': ['flex'],
      'justify-content': ['flex-end'],
    },
    hint: "בלי display: flex שאר המאפיינים לא משפיעים בכלל. flex-end דוחף לסוף הציר הראשי.",
  },

  {
    id: 2,
    title: "מגדל מטען",
    instruction: "העמידו את ארבעת התאים בטור אחד, מלמעלה למטה, כשתא 1 בראש.",
    items: 4,
    itemSizes: null,
    controls: ['flex-direction'],
    solution: {
      'flex-direction': ['column'],
    },
    hint: "flex-direction קובע את הציר הראשי: row הוא שורה, column הוא טור.",
  },

  {
    id: 3,
    title: "עגינה מרכזית",
    instruction: "רכזו את שלושת התאים בדיוק במרכז הלוח — גם לרוחב וגם לגובה.",
    items: 3,
    itemSizes: null,
    controls: ['justify-content', 'align-items'],
    solution: {
      'justify-content': ['center'],
      'align-items': ['center'],
    },
    hint: "justify-content עובד על הציר הראשי (כאן: לרוחב), align-items על הציר המשני (לגובה). כאן צריך את שניהם.",
  },

  {
    id: 4,
    title: "רציף תחתון",
    instruction: "פרסו את חמשת התאים לרוחב הלוח עם מרווחים שווים ביניהם, כך שהתא הראשון והאחרון נוגעים בקצוות, וכולם יושבים על תחתית הלוח.",
    items: 5,
    itemSizes: null,
    controls: ['justify-content', 'align-items'],
    solution: {
      'justify-content': ['space-between'],
      'align-items': ['flex-end'],
    },
    hint: "יש כמה ערכי space-*. רק אחד מהם לא משאיר מרווח בקצוות. התחתית היא align-items.",
  },

  {
    id: 5,
    title: "טור הפוך",
    instruction: "סדרו את ארבעת התאים בטור שבו תא 1 בתחתית ותא 4 בראש, וממורכזים לרוחב הלוח.",
    items: 4,
    itemSizes: null,
    controls: ['flex-direction', 'align-items'],
    solution: {
      'flex-direction': ['column-reverse'],
      'align-items': ['center'],
    },
    hint: "המספרים על התאים הם סדר ה-HTML ולא הסדר שרואים. יש כיוון שהופך טור. שימו לב שבטור, align-items מרכז לרוחב.",
  },

  {
    id: 6,
    title: "מרווח שווה",
    instruction: "סדרו את ארבעת התאים בטור עם מרווח זהה לגמרי מעל, מתחת וביניהם, והצמידו אותם לקצה השמאלי של הלוח.",
    items: 4,
    itemSizes: null,
    controls: ['flex-direction', 'justify-content', 'align-items'],
    solution: {
      'flex-direction': ['column'],
      'justify-content': ['space-evenly'],
      'align-items': ['flex-start'],
    },
    hint: "space-around משאיר בקצוות חצי מרווח. הערך שנותן מרווח זהה לחלוטין בכל מקום הוא אחר. בטור, ההצמדה לצד היא align-items.",
  },

  {
    id: 7,
    title: "משמרת עמוסה",
    instruction: "עשרה תאים נכנסו לתא המעבר ואינם נכנסים בשורה אחת — חלקם נחתכים בקצה. אפשרו להם לרדת לשורה נוספת, ומרכזו כל שורה לרוחב הלוח.",
    items: 10,
    itemSizes: null,
    controls: ['flex-wrap', 'justify-content'],
    solution: {
      'flex-wrap': ['wrap'],
      'justify-content': ['center'],
    },
    hint: "ברירת המחדל היא nowrap — Flex דוחס הכול לשורה אחת גם כשאין מקום. flex-wrap מרשה שבירה לשורות.",
  },

  {
    id: 8,
    title: "עגינה סופית",
    instruction: "התאים בגדלים שונים. סדרו אותם בשורה הפוכה — תא 1 בקצה הימני — עם מרווח זהה מסביב לכל תא (כלומר בקצוות חצי מהמרווח שבין התאים), וכולם ממורכזים לגובה הלוח.",
    items: 5,
    itemSizes: ['sm', 'lg', 'sm', 'lg', 'sm'],
    controls: ['flex-direction', 'justify-content', 'align-items'],
    solution: {
      'flex-direction': ['row-reverse'],
      'justify-content': ['space-around'],
      'align-items': ['center'],
    },
    hint: "שלושה מאפיינים יחד. המרווח בקצוות שהוא חצי מהמרווח הפנימי הוא בדיוק ההגדרה של space-around.",
  },
];
