import { useState, useEffect } from 'react';

// 事前定義データ: 達成時にランダムで出る名言・メッセージ
const MOTIVATION_QUOTES = [
  { text: '一歩一歩の積み重ねが、思いがけない高みに連れて行ってくれる。', author: 'イチロー' },
  { text: '成功とは、情熱を失わずに失敗を重ねていく能力のことである。', author: 'ウィンストン・チャーチル' },
  { text: '努力は必ず報われる。もし報われない努力があるのならば、それはまだ努力とは呼べない。', author: '王貞治' },
  { text: '最も困難な挑戦にこそ、最も大きな価値がある。', author: 'ルース・ベイダー・ギンズバーグ' },
  { text: '集中できた自分に拍手！次のステップへ進もう。', author: 'Study Quest' },
];

function App() {
  // タイマー秒数（テストしやすいよう初期値は 5分: 300秒 / モード切替可）
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [isActive, setIsActive] = useState(false);

  // クエスト達成数・現在のメッセージ
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentQuote, setCurrentQuote] = useState(MOTIVATION_QUOTES[0]);

  // 今日の学習ログ一覧（配列state）
  const [logs, setLogs] = useState([]);
  const [taskName, setTaskName] = useState('');

  // タイマーのカウントダウン処理
  useEffect(() => {
    let timerId = null;
    if (isActive && secondsLeft > 0) {
      timerId = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      // タイマー終了時の処理
      setIsActive(false);
      setCompletedSessions((prev) => prev + 1);

      // ランダムに名言を切り替え
      const randomIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
      setCurrentQuote(MOTIVATION_QUOTES[randomIndex]);

      // ログに自動記録（イミュータブルに追加）
      const newLog = {
        id: Date.now(),
        title: taskName.trim() ? taskName : '集中セッション',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setLogs((prevLogs) => [newLog, ...prevLogs]);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isActive, secondsLeft, taskName]);

  // タイマーのリセット
  const resetTimer = (minutes) => {
    setIsActive(false);
    setSecondsLeft(minutes * 60);
  };

  // ログの削除（イミュータブルに更新）
  const deleteLog = (id) => {
    setLogs(logs.filter((log) => log.id !== id));
  };

  // 秒を mm:ss 形式に変換
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 py-10 px-4">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* ヘッダー */}
        <header className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">
            Productivity & Mindset
          </span>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-sky-300 bg-clip-text text-transparent">
            Study Quest
          </h1>
          <p className="text-sm text-slate-400">
            集中時間を記録して、名言とともに前進しよう
          </p>
        </header>

        {/* タイマーカード */}
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-6 text-center shadow-xl">
          {/* プリセット選択ボタン */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => resetTimer(5)}
              className="px-3 py-1 text-xs rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition"
            >
              5分 (確認用)
            </button>
            <button
              onClick={() => resetTimer(25)}
              className="px-3 py-1 text-xs rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition"
            >
              25分 (集中)
            </button>
            <button
              onClick={() => resetTimer(1)}
              className="px-3 py-1 text-xs rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition"
            >
              1分 (テスト)
            </button>
          </div>

          {/* 取り組むタスク入力欄 */}
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="今から集中する内容（例: 民法の復習）"
            disabled={isActive}
            className="w-full text-center px-4 py-2 mb-6 bg-slate-900/60 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* カウントダウン表示 */}
          <div className="text-6xl font-mono font-bold tracking-tight text-indigo-300 mb-6">
            {formatTime(secondsLeft)}
          </div>

          {/* 操作ボタン */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-6 py-2.5 rounded-xl font-medium shadow-md transition ${
                isActive
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isActive ? '一時停止' : 'スタート'}
            </button>
            <button
              onClick={() => resetTimer(5)}
              className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition"
            >
              リセット
            </button>
          </div>
        </div>

        {/* 名言メッセージカード */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-sky-400">今日のメッセージ</span>
            <span className="text-xs text-slate-400">達成: {completedSessions} セッション</span>
          </div>
          <blockquote className="text-sm italic text-slate-200 mb-1">
            "{currentQuote.text}"
          </blockquote>
          <p className="text-xs text-right text-slate-400">— {currentQuote.author}</p>
        </div>

        {/* 達成セッションログ */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-5 shadow">
          <h2 className="text-sm font-semibold text-slate-200 mb-3">
            完了ログ ({logs.length})
          </h2>
          {logs.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">
              まだ記録はありません。タイマーを完了すると記録されます。
            </p>
          ) : (
            <ul className="space-y-2">
              {logs.map((log) => (
                <li
                  key={log.id}
                  className="flex items-center justify-between p-2.5 bg-slate-900/40 rounded-lg text-xs border border-slate-700/40"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-indigo-400 font-mono">[{log.time}]</span>
                    <span className="text-slate-300 truncate">{log.title}</span>
                  </div>
                  <button
                    onClick={() => deleteLog(log.id)}
                    className="text-slate-500 hover:text-rose-400 transition ml-2"
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;