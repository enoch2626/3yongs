export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.stream = stream;
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('음성 녹음 시작 실패:', error);
      throw new Error('마이크 권한이 필요합니다.');
    }
  }

  async stopRecording(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('녹음기가 시작되지 않았습니다.'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        resolve(audioUrl);
      };

      this.mediaRecorder.stop();
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
      }
    });
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
}

// Web Speech API를 사용한 음성 인식
export class SpeechRecognizer {
  private recognition: SpeechRecognition | null = null;

  constructor() {
    const SpeechRecognition = 
      window.SpeechRecognition || 
      window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      throw new Error('이 브라우저는 음성 인식을 지원하지 않습니다.');
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'ko-KR';
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
  }

  start(onResult: (text: string) => void, onError?: (error: string) => void): void {
    if (!this.recognition) return;

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      if (onError) {
        onError(event.error);
      }
    };

    this.recognition.start();
  }

  stop(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}

