// 要素取得
const videoPlayer = document.getElementById('video-player');
const timestampsTextarea = document.getElementById('timestamps');
const startButton = document.getElementById('start-button');
const stopButton = document.getElementById('stop-button');
const downloadSrtButton = document.getElementById('download-srt');
const timerDisplay = document.getElementById('timer');

// タイマー関連
let timestamps = [];
let elapsedTime = 0; // 現在の経過時間
let isTimerRunning = false;
let timerInterval = null;
let lastStopTime = 0; // 前回のSTOP時刻を保持

// 時間フォーマット補助関数
function formatTime(seconds) {
    const date = new Date(seconds * 1000);
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const secs = String(date.getUTCSeconds()).padStart(2, '0');
    const millis = String(date.getUTCMilliseconds()).padStart(3, '0');
    return `${hours}:${minutes}:${secs},${millis}`;
}

// タイマー表示更新
function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(elapsedTime);
}

// STARTボタン
startButton.addEventListener('click', () => {
    if (!isTimerRunning) {
        isTimerRunning = true;

        // タイマー開始（前回のSTOP時刻から継続）
        const startTime = performance.now() / 1000;
        timerInterval = setInterval(() => {
            elapsedTime = performance.now() / 1000 - startTime + lastStopTime;
            updateTimerDisplay();
        }, 10); // 10ms間隔で更新
    }
});

// STOPボタン
stopButton.addEventListener('click', () => {
    if (isTimerRunning) {
        clearInterval(timerInterval); // タイマー停止
        isTimerRunning = false;

        const stopTimestamp = elapsedTime; // 現在の経過時間
        const startTimestamp = lastStopTime; // 前回のSTOPを開始時刻とする

        // タイムスタンプを記録
        timestamps.push({
            start: formatTime(startTimestamp),
            stop: formatTime(stopTimestamp),
        });

        // 次回の再開のために現在の停止時刻を記録
        lastStopTime = stopTimestamp;

        updateTimestamps();
    }
});

// タイムスタンプ表示更新
function updateTimestamps() {
    timestampsTextarea.value = timestamps
        .map((time, index) => `${index + 1}\n${time.start} --> ${time.stop}\n字幕内容をここに入力\n`)
        .join('\n');
}

// SRTファイルをダウンロード
downloadSrtButton.addEventListener('click', () => {
    const srtContent = timestamps
        .map((time, index) => `${index + 1}\n${time.start} --> ${time.stop}\n字幕内容をここに入力\n`)
        .join('\n');
    const blob = new Blob([srtContent], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'subtitles.srt';
    a.click();
});

// YouTube動画切り替え
document.querySelectorAll('.youtube-url').forEach(button => {
    button.addEventListener('click', () => {
        const videoUrl = button.getAttribute('data-url');
        const videoId = new URL(videoUrl).searchParams.get('v');
        videoPlayer.innerHTML = `
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
        `;
    });
});
