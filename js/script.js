// YouTubeのiframe生成とタイムスタンプ管理
const videoPlayer = document.getElementById('video-player');
const timestampsTextarea = document.getElementById('timestamps');
const addTimestampButton = document.getElementById('add-timestamp');
const downloadSrtButton = document.getElementById('download-srt');

// ボタンでYouTube動画を切り替える
document.querySelectorAll('.youtube-url').forEach(button => {
    button.addEventListener('click', () => {
        const videoUrl = button.getAttribute('data-url');
        const videoId = new URL(videoUrl).searchParams.get('v');
        videoPlayer.innerHTML = `
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
        `;
    });
});

// タイムスタンプリスト
let timestamps = [];

// タイムスタンプ追加
addTimestampButton.addEventListener('click', () => {
    const currentTime = new Date().toISOString().substr(11, 8); // 現在の時刻を簡易的に使用
    timestamps.push(currentTime);
    updateTimestamps();
});

// タイムスタンプ表示更新
function updateTimestamps() {
    timestampsTextarea.value = timestamps.map((time, index) => `${index + 1}\n${time}\n`).join('\n');
}

// SRTファイルをダウンロード
downloadSrtButton.addEventListener('click', () => {
    const srtContent = timestamps
        .map((time, index) => `${index + 1}\n00:${time},000 --> 00:${time},999\n字幕内容をここに入力\n`)
        .join('\n');
    const blob = new Blob([srtContent], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'subtitles.srt';
    a.click();
});
