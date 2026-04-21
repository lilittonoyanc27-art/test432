import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  RotateCcw, 
  Play, 
  BookOpen, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---

interface Question {
  id: number;
  sentence: string;
  hint: string;
  options: string[];
  correct: string;
  translation: string;
  explanation: string;
}

// --- Data: Personal Pronouns & Possessive Adjectives ---

const QUESTIONS: Question[] = [
  { 
    id: 1, 
    sentence: "___ soy estudiante de español.", 
    hint: "I (Yo)", 
    options: ["Yo", "Mi"], 
    correct: "Yo", 
    translation: "Ես իսպաներենի ուսանող եմ:", 
    explanation: "'Yo'-ն անձնական դերանուն է (Ես), իսկ 'Mi'-ն՝ ստացական (Իմ):" 
  },
  { 
    id: 2, 
    sentence: "___ hermano tiene diez años.", 
    hint: "My (Իմ)", 
    options: ["Yo", "Mi"], 
    correct: "Mi", 
    translation: "Իմ եղբայրը տասը տարեկան է:", 
    explanation: "'Mi'-ն օգտագործվում է գոյականից առաջ պատկանելիություն ցույց տալու համար:" 
  },
  { 
    id: 3, 
    sentence: "___ hablas muy bien español.", 
    hint: "You (Tú)", 
    options: ["Tú", "Tu"], 
    correct: "Tú", 
    translation: "Դու շատ լավ ես խոսում իսպաներեն:", 
    explanation: "'Tú'-ն (շեշտով) նշանակում է 'Դու' (անձ), իսկ 'Tu'-ն (առանց շեշտի)՝ 'Քո':" 
  },
  { 
    id: 4, 
    sentence: "¿Es ___ coche nuevo?", 
    hint: "Your (Քո)", 
    options: ["Tú", "Tu"], 
    correct: "Tu", 
    translation: "Սա քո՞ նոր մեքենան է:", 
    explanation: "'Tu'-ն (առանց շեշտի) օգտագործվում է որպես ստացական ածական (Քո):" 
  },
  { 
    id: 5, 
    sentence: "___ trabaja en un banco.", 
    hint: "He (Él)", 
    options: ["Él", "Su"], 
    correct: "Él", 
    translation: "Նա (արական) աշխատում է բանկում:", 
    explanation: "'Él'-ը անձնական դերանուն է (Նա), իսկ 'Su'-ն՝ ստացական (Նրա):" 
  },
  { 
    id: 6, 
    sentence: "___ amigo se llama Pedro.", 
    hint: "His (Նրա)", 
    options: ["Él", "Su"], 
    correct: "Su", 
    translation: "Նրա ընկերոջ անունը Պեդրո է:", 
    explanation: "'Su'-ն նշանակում է 'Նրա' (նաև 'Ձեր', 'Նրանց') և դրվում է գոյականից առաջ:" 
  },
  { 
    id: 7, 
    sentence: "___ somos de Armenia.", 
    hint: "We (Nosotros)", 
    options: ["Nosotros", "Nuestro"], 
    correct: "Nosotros", 
    translation: "Մենք Հայաստանից ենք:", 
    explanation: "'Nosotros'-ը անձնական դերանուն է (Մենք):" 
  },
  { 
    id: 8, 
    sentence: "___ país es hermoso.", 
    hint: "Our (Մեր)", 
    options: ["Nosotros", "Nuestro"], 
    correct: "Nuestro", 
    translation: "Մեր երկիրը գեղեցիկ է:", 
    explanation: "'Nuestro'-ն ստացական ածական է (Մեր) և համաձայնում է գոյականի հետ սեռով և թվով:" 
  },
  { 
    id: 9, 
    sentence: "___ gatos son muy pequeños.", 
    hint: "Your-plural (Ձեր - vuestros)", 
    options: ["Vosotros", "Vuestros"], 
    correct: "Vuestros", 
    translation: "Ձեր կատուները շատ փոքր են:", 
    explanation: "'Vuestros'-ը համաձայնում է հոգնակի արական գոյականի (gatos) հետ:" 
  },
  { 
    id: 10, 
    sentence: "___ padres están en casa.", 
    hint: "My-plural (Իմ - mis)", 
    options: ["Mi", "Mis"], 
    correct: "Mis", 
    translation: "Իմ ծնողները տանն են:", 
    explanation: "'Mis'-ը 'Mi'-ի հոգնակի ձևն է, քանի որ 'padres'-ը հոգնակի է:" 
  },
  { 
    id: 11, 
    sentence: "Me gustan ___ zapatos rojos.", 
    hint: "Your-plural (Քո - tus)", 
    options: ["Tu", "Tus"], 
    correct: "Tus", 
    translation: "Ինձ դուր են գալիս քո կարմիր կոշիկները:", 
    explanation: "Երբ գոյականը հոգնակի է (zapatos), ստացականը նույնպես դառնում է հոգնակի (Tus):" 
  },
  { 
    id: 12, 
    sentence: "Ellos leen ___ libros favoritos.", 
    hint: "Their (Նրանց - sus)", 
    options: ["Su", "Sus"], 
    correct: "Sus", 
    translation: "Նրանք կարդում են իրենց սիրելի գրքերը:", 
    explanation: "'Sus'-ը օգտագործվում է, երբ պատկանող իրերը (libros) հոգնակի են:" 
  },
  { 
    id: 13, 
    sentence: "___ familia es muy numerosa.", 
    hint: "Our-fem (Մեր - nuestra)", 
    options: ["Nuestro", "Nuestra"], 
    correct: "Nuestra", 
    translation: "Մեր ընտանիքը շատ մեծ է:", 
    explanation: "'Familia'-ն իգական սեռի է, ուստի օգտագործում ենք 'Nuestra':" 
  },
  { 
    id: 14, 
    sentence: "___ son profesoras de música.", 
    hint: "They-fem (Նրանք - ellas)", 
    options: ["Ellas", "Sus"], 
    correct: "Ellas", 
    translation: "Նրանք երաժշտության ուսուցչուհիներ են:", 
    explanation: "'Ellas'-ը անձնական դերանուն է (Նրանք՝ իգական սեռի):" 
  },
  { 
    id: 15, 
    sentence: "¿Dónde está ___ casa?", 
    hint: "Your-plural (Ձեր - vuestra)", 
    options: ["Vosotros", "Vuestra"], 
    correct: "Vuestra", 
    translation: "Որտե՞ղ է ձեր տունը:", 
    explanation: "'Vuestra'-ն օգտագործվում է եզակի իգական գոյականի (casa) հետ:" 
  },
  { 
    id: 16, 
    sentence: "___ estudio mucho todos los días.", 
    hint: "I (Ես - yo)", 
    options: ["Yo", "Mi"], 
    correct: "Yo", 
    translation: "Ես ամեն օր շատ եմ սովորում:", 
    explanation: "Գործողությունը կատարողը ես եմ (Yo):" 
  },
  { 
    id: 17, 
    sentence: "___ perro es muy juguetón.", 
    hint: "Your (Քո - tu)", 
    options: ["Tú", "Tu"], 
    correct: "Tu", 
    translation: "Քո շունը շատ խաղացկուն է:", 
    explanation: "'Tu' (առանց շեշտի) նշանակում է 'Քո':" 
  },
  { 
    id: 18, 
    sentence: "María limpia ___ habitación.", 
    hint: "Her (Նրա - su)", 
    options: ["Ella", "Su"], 
    correct: "Su", 
    translation: "Մարիան մաքրում է իր սենյակը:", 
    explanation: "'Su'-ն նշանակում է 'Նրա' պատկանելիությունը:" 
  },
  { 
    id: 19, 
    sentence: "___ vivimos en un piso pequeño.", 
    hint: "We (Մենք - nosotros)", 
    options: ["Nosotros", "Nuestros"], 
    correct: "Nosotros", 
    translation: "Մենք ապրում ենք փոքր բնակարանում:", 
    explanation: "Այստեղ անհրաժեշտ է անձնական դերանուն (Nosotros):" 
  },
  { 
    id: 20, 
    sentence: "Los niños pierden ___ juguetes.", 
    hint: "Their (Իրենց - sus)", 
    options: ["Ellos", "Sus"], 
    correct: "Sus", 
    translation: "Երեխաները կորցնում են իրենց խաղալիքները:", 
    explanation: "'Sus'-ը համաձայնում է հոգնակի գոյականի (juguetes) հետ:" 
  }
];

export default function GrammarMaster() {
  const [view, setView] = useState<'intro' | 'theory' | 'play' | 'result'>('intro');
  const [score, setScore] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const startTraining = () => {
    setScore(0);
    setCurrentIdx(0);
    setView('play');
    setSelected(null);
  };

  const handleAnswer = (option: string) => {
    if (selected) return;
    
    setSelected(option);
    const correct = QUESTIONS[currentIdx].correct;
    const right = option === correct;
    setIsCorrect(right);

    if (right) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    setSelected(null);
    setIsCorrect(null);
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setView('result');
      if (score > 15) confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500/30 flex flex-col overflow-x-hidden">
      
      {/* HUD Header */}
      <nav className="p-6 flex justify-between items-center bg-slate-950/50 backdrop-blur-md border-b border-white/5 relative z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase italic">Grammar <span className="text-indigo-400">Sphere</span></h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">Language Evolution</p>
          </div>
        </div>

        {view === 'play' && (
          <div className="flex items-center gap-6">
             <div className="text-right">
                <span className="block text-[8px] font-black uppercase text-slate-500 tracking-widest">Progress</span>
                <span className="text-lg font-black italic tracking-tighter">{currentIdx + 1}/{QUESTIONS.length}</span>
             </div>
             <div className="w-[1px] h-8 bg-white/10" />
             <div className="text-right">
                <span className="block text-[8px] font-black uppercase text-slate-500 tracking-widest">Correct</span>
                <span className="text-lg font-black italic tracking-tighter text-indigo-400">{score}</span>
             </div>
          </div>
        )}
      </nav>

      <main className="flex-1 relative flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b,transparent)]">
        
        <AnimatePresence mode="wait">
          
          {view === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="max-w-md w-full text-center space-y-10"
            >
              <div className="space-y-6">
                 <div className="w-40 h-40 bg-indigo-600 rounded-[50px] flex items-center justify-center mx-auto shadow-2xl relative">
                    <BookOpen size={80} className="text-white drop-shadow-2xl" />
                    <div className="absolute -top-4 -right-4 bg-emerald-500 p-3 rounded-2xl shadow-xl animate-bounce">
                       <CheckCircle2 size={24} className="text-white" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none">Spanish <br/> Pronouns</h2>
                    <p className="text-slate-400 font-medium px-4">Յուրացրեք անձնական դերանունները և ստացական ածականները:</p>
                 </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setView('theory')}
                  className="w-full py-5 bg-white/5 hover:bg-white/10 text-white rounded-3xl font-black uppercase text-sm border border-white/10 transition-all flex items-center justify-center gap-2 group italic tracking-widest"
                >
                  <Info size={18} /> Կարդալ Տեսությունը
                </button>
                <button 
                  onClick={startTraining}
                  className="w-full py-6 bg-indigo-500 text-white rounded-[40px] font-black uppercase text-2xl shadow-2xl shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 italic"
                >
                  Սկսել Դասը <Play fill="currentColor" size={24} />
                </button>
              </div>
            </motion.div>
          )}

          {view === 'theory' && (
            <motion.div 
              key="theory"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-2xl w-full bg-slate-800/80 backdrop-blur-xl p-10 rounded-[60px] border border-white/5 shadow-2xl space-y-8 max-h-[80vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center gap-4 mb-4">
                 <ArrowRight className="text-indigo-400 rotate-180 cursor-pointer" onClick={() => setView('intro')} />
                 <h3 className="text-3xl font-black uppercase italic tracking-tighter">Իսպաներենի Դերանուններ</h3>
              </div>

              <div className="space-y-6 text-slate-300">
                <section className="space-y-3">
                  <h4 className="text-indigo-400 font-black uppercase tracking-widest text-xs">1. Անձնական դերանուններ (Personal Pronouns)</h4>
                  <p className="text-sm">Ցույց են տալիս գործողություն կատարողին (Ես, Դու, Նա...):</p>
                  <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                    <div className="bg-white/5 p-2 rounded-lg">Yo (Ես)</div>
                    <div className="bg-white/5 p-2 rounded-lg">Nosotros (Մենք)</div>
                    <div className="bg-white/5 p-2 rounded-lg">Tú (Դու)</div>
                    <div className="bg-white/5 p-2 rounded-lg">Vosotros (Դուք)</div>
                    <div className="bg-white/5 p-2 rounded-lg">Él/Ella (Նա)</div>
                    <div className="bg-white/5 p-2 rounded-lg">Ellos/Ellas (Նրանք)</div>
                    <div className="bg-white/5 p-2 rounded-lg">Usted (Դուք - եզակի)</div>
                    <div className="bg-white/5 p-2 rounded-lg">Ustedes (Դուք - հոգնակի)</div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h4 className="text-indigo-400 font-black uppercase tracking-widest text-xs">2. Ստացական ածականներ (Possessive Adjectives)</h4>
                  <p className="text-sm">Ցույց են տալիս պատկանելիություն (Իմ, Քո, Նրա...): Նրանք համաձայնում են պատկանող իրի (գոյականի) թվի հետ:</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="font-bold text-white italic">Mi / Mis</span> <span>Իմ</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="font-bold text-white italic">Tu / Tus</span> <span>Քո</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="font-bold text-white italic">Su / Sus</span> <span>Նրա / Ձեր (հարգալից)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="font-bold text-white italic">Nuestro/a/os/as</span> <span>Մեր</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="font-bold text-white italic">Vuestro/a/os/as</span> <span>Ձեր (հոգնակի)</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="font-bold text-white italic">Su / Sus</span> <span>Նրանց / Ձեր (Ustedes)</span>
                    </div>
                  </div>
                  <p className="text-xs text-indigo-400/70 italic mt-4">Կարևոր է՝Nuestro-ն և Vuestro-ն համաձայնում են նաև սեռի հետ (արական/իգական):</p>
                </section>
              </div>

              <button 
                onClick={startTraining}
                className="w-full py-5 bg-indigo-500 text-white rounded-[35px] font-black uppercase text-xl shadow-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2 italic"
              >
                Սկսել Մարզումը <ChevronRight size={24} />
              </button>
            </motion.div>
          )}

          {view === 'play' && (
            <motion.div 
              key="play"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full max-w-3xl space-y-12"
            >
              {/* Question Header */}
              <div className="text-center space-y-2">
                 <div className="inline-block px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em] border border-white/5">
                    Exercise {currentIdx + 1}
                 </div>
                 <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight text-white/90">
                    {QUESTIONS[currentIdx].sentence.split('___').map((part, i) => (
                      <React.Fragment key={i}>
                        {part}
                        {i === 0 && (
                          <span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-8 px-2 min-w-[100px] inline-block text-center italic">
                            {selected || '...'}
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                 </h3>
                 <div className="flex items-center justify-center gap-2 text-slate-500 font-bold italic">
                    <Sparkles size={16} /> {QUESTIONS[currentIdx].hint} - {QUESTIONS[currentIdx].translation}
                 </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto">
                 {QUESTIONS[currentIdx].options.map((option) => (
                   <button
                     key={option}
                     onClick={() => handleAnswer(option)}
                     disabled={!!selected}
                     className={`
                        py-10 rounded-[40px] text-3xl md:text-5xl font-black italic uppercase tracking-tighter transition-all border-4 shadow-2xl
                        ${selected === option 
                             ? (isCorrect ? 'bg-indigo-600 border-indigo-400 text-white scale-105' : 'bg-rose-600 border-rose-400 text-white ring-8 ring-rose-600/20')
                             : (selected && option === QUESTIONS[currentIdx].correct ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300')
                        }
                     `}
                   >
                     {option}
                   </button>
                 ))}
              </div>

              {/* Feedback */}
              <div className="h-40 relative">
                <AnimatePresence>
                   {selected && (
                     <motion.div 
                       initial={{ opacity: 0, scale: 0.9, y: 20 }}
                       animate={{ opacity: 1, scale: 1, y: 0 }}
                       className="bg-slate-800/80 backdrop-blur-xl p-8 rounded-[40px] border border-white/5 shadow-2xl flex flex-col gap-3 items-center text-center w-full max-w-lg mx-auto"
                     >
                        <div className={`flex items-center gap-3 font-black uppercase tracking-[0.2em] text-xs ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                           {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                           {isCorrect ? "Գերազանց է!" : "Ոայ, Սխալ է!"}
                        </div>
                        <p className="text-slate-300 text-sm font-medium leading-relaxed italic">{QUESTIONS[currentIdx].explanation}</p>
                        <button 
                          onClick={nextQuestion}
                          className="mt-4 bg-indigo-500 text-white px-10 py-3 rounded-full font-black uppercase text-xs flex items-center gap-2 hover:scale-110 active:scale-95 transition-all shadow-xl shadow-indigo-500/20"
                        >
                          Շարունակել <ArrowRight size={16} />
                        </button>
                     </motion.div>
                   )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {view === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full text-center space-y-10"
            >
              <div className="space-y-6">
                 <Trophy size={100} className="text-indigo-400 mx-auto drop-shadow-[0_0_30px_rgba(129,140,248,0.5)]" />
                 <div className="space-y-2">
                    <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none text-white">Grammar King!</h2>
                    <p className="text-xl font-bold text-slate-400 italic">Դուք փայլուն տիրապետում եք դերանուններին: <br/> {score} / {QUESTIONS.length}</p>
                 </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl p-10 rounded-[50px] border border-white/10 relative overflow-hidden group">
                 <div className="text-8xl font-black italic text-indigo-400 tracking-tighter">
                   {Math.round((score/QUESTIONS.length) * 100)}%
                 </div>
                 <p className="text-[10px] uppercase font-black text-slate-500 tracking-[0.5em] mt-4 leading-none">Accuracy Level</p>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
              </div>

              <button 
                onClick={() => setView('intro')}
                className="w-full py-7 bg-indigo-500 text-white rounded-[40px] font-black uppercase text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 italic"
              >
                Նորից <RotateCcw size={28} />
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="p-10 flex justify-center opacity-20 pointer-events-none mt-auto">
        <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-[0.6em] text-slate-500">
          <span>Grammar AI</span>
          <div className="w-1 h-1 bg-slate-700 rounded-full" />
          <span>Linguistic Mastery</span>
          <div className="w-1 h-1 bg-slate-700 rounded-full" />
          <span>Spanish Logic</span>
        </div>
      </footer>
    </div>
  );
}
