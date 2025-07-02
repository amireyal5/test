import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { Patient, SessionNote } from '@/types';
import { differenceInYears } from 'date-fns';

const parseMarkdown = (text: string) => {
    if (!text) return '';
    const lines = text.split('\n');
    let html = '';
    let inList = false;

    lines.forEach(line => {
        if (!line.trim()) return;

        let processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        if (processedLine.trim().startsWith('* ') || processedLine.trim().startsWith('- ')) {
            if (!inList) {
                html += '<ul>';
                inList = true;
            }
            html += `<li>${processedLine.trim().substring(2)}</li>`;
        } else {
            if (inList) {
                html += '</ul>';
                inList = false;
            }
            html += `<p>${processedLine}</p>`;
        }
    });

    if (inList) {
        html += '</ul>';
    }

    return html.replace(/<p><\/p>/g, '');
};


export async function POST(req: NextRequest) {
    try {
        if (!process.env.API_KEY) {
            console.error('API key is not configured.');
            return NextResponse.json({ error: 'API key is not configured on the server.' }, { status: 500 });
        }

        const body = await req.json();
        const { actionType, patient, notes } = body as { actionType: string, patient: Patient, notes: SessionNote[] };

        if (!actionType || !patient) {
            return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let prompt = '';
        let title = '';

        const age = patient.birthDate ? differenceInYears(new Date(), new Date(patient.birthDate)) : 'לא ידוע';
        const patientNotesText = notes && notes.length > 0 ? notes.slice(0, 3).map(n => `- ${n.date}: ${n.content}`).join('\n') : "אין הערות זמינות.";
        
        const patientContext = `פרטי מטופל:
        שם: ${patient.name}
        גיל: ${age}
        סטטוס: ${patient.status === 'Active' ? 'פעיל' : 'לא פעיל'}
        הערות אחרונות מהפגישות:
        ${patientNotesText || "לא נמצאו הערות קודמות."}
        `;

        switch (actionType) {
            case 'summarize':
                title = `סיכום טיפול עבור ${patient.name}`;
                prompt = `בהתבסס על ההקשר הבא, כתוב סיכום פגישה קצר. הסיכום צריך להיות מקצועי, תמציתי ומאורגן. התמקד בבעיות שהועלו, התקדמות ותוכניות עתידיות. אל תמציא פרטים שלא נמצאים בהקשר.\n\nהקשר:\n${patientContext}`;
                break;
            case 'goals':
                title = `הצעת מטרות טיפול עבור ${patient.name}`;
                prompt = `בהתבסס על ההקשר הבא, נסח 3-4 מטרות טיפול ממוקדות וניתנות למדידה (בפורמט SMART) עבור המטופל.\n\nהקשר:\n${patientContext}`;
                break;
            case 'recommendations':
                title = `המלצות להמשך טיפול`;
                prompt = `בהתבסס על ההקשר הבא, ספק 3 המלצות מעשיות למטפל להמשך הטיפול עם ${patient.name}.\n\nהקשר:\n${patientContext}`;
                break;
            default:
                return NextResponse.json({ error: 'Invalid action type.' }, { status: 400 });
        }

        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
            config: {
                systemInstruction: "אתה עוזר AI מיומן עבור מטפלים בקליניקה ששמה SmartClinic. תשובותיך צריכות להיות מקצועיות, כתובות בעברית, ומעוצבות באמצעות Markdown (הדגשות עם **טקסט מודגש** ורשימות עם - או *).",
                temperature: 0.7,
            }
        });
        const text = result.text;
        
        const htmlContent = parseMarkdown(text ?? '');

        return NextResponse.json({ title, content: htmlContent });

    } catch (e) {
        console.error("API Route Error:", e);
        // It's better not to expose internal error details to the client
        return NextResponse.json({ error: 'An error occurred while processing your request with the AI assistant.' }, { status: 500 });
    }
}