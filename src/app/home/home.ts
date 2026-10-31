import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';

interface SceneData {
  bgImage: string;
  narrationText: string;
  narrationAudioUrl: string;
  rabbitAudioUrl?: string;
  flowerAudioUrl?: string;
  butterflyAudioUrl?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements AfterViewInit {
  currentScene = 0; // 0: Mở đầu, 1: Chặng 1, 2: Chặng 2, 3: Chặng 3

  showRabbitBubble = false;
  showFlowerBubble = false;
  showButterflyBubble = false;

  private currentAudio: HTMLAudioElement | null = null;

  // =========================================================================
  // BẢNG CẤU HÌNH TẬP TRUNG: Thay đổi hình ảnh và đường dẫn âm thanh tại đây
  // =========================================================================
  readonly scenesConfig: SceneData[] = [
    {
      bgImage: '/images/intro.png',
      narrationText: '',
      narrationAudioUrl: ''
    },
    {
      bgImage: '/images/abc.png',
      narrationText: 'Thỏ Con đi chơi. Thỏ đi, thỏ đi!',
      narrationAudioUrl: '/audios/tho_text.m4a', // <-- Thay URL audio chặng 1
      rabbitAudioUrl: '/audios/tho_voice.m4a'          // <-- Thay URL âm thanh Thỏ
    },
    {
      bgImage: '/images/xyz.png',
      narrationText: 'Ó! Bông hoa đẹp quá! Hoa, hoa!',
      narrationAudioUrl: '/audios/flower_text.m4a', // <-- Thay URL audio chặng 2
      rabbitAudioUrl: '/audios/tho_voice.m4a',
      flowerAudioUrl: '/audios/flower_voice.m4a'         // <-- Thay URL âm thanh Hoa
    },
    {
      bgImage: '/images/vvv.png',
      narrationText: 'Bướm bay! Bướm bay! Thỏ chào bướm nhé!',
      narrationAudioUrl: '/audios/butter_text.m4a', // <-- Thay URL audio chặng 3
      rabbitAudioUrl: '/audios/tho_voice.m4a',
      butterflyAudioUrl: '/audios/butter_voice.m4a'   // <-- Thay URL âm thanh Bướm
    }
  ];
  ngAfterViewInit() {
    this.autoPlayNarration();
    this.updateViewportHeight();
    window.addEventListener('resize', this.updateViewportHeight);
    window.addEventListener('orientationchange', this.updateViewportHeight);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateViewportHeight);
    window.removeEventListener('orientationchange', this.updateViewportHeight);
  }

  // Hàm đo chiều cao thực tế bỏ qua thanh địa chỉ của trình duyệt mobile
  private updateViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  // Chuyển đổi cảnh truyện kèm reset trạng thái bong bóng và phát âm thanh
  goToScene(sceneIndex: number) {
    this.currentScene = sceneIndex;
    this.resetBubbles();

    setTimeout(() => {
      this.autoPlayNarration();
    }, 300);
  }

  // Ẩn tất cả bong bóng hội thoại
  resetBubbles() {
    this.showRabbitBubble = false;
    this.showFlowerBubble = false;
    this.showButterflyBubble = false;
  }

  // Tự động phát âm thanh lời kể cốt truyện khi chuyển cảnh
  autoPlayNarration() {
    const currentData = this.scenesConfig[this.currentScene];
    if (this.currentScene > 0 && currentData?.narrationAudioUrl) {
      this.playSound(currentData.narrationAudioUrl);
    }
  }

  // Tương tác chạm vào Thỏ
  playRabbitSound() {
    this.showRabbitBubble = true;
    this.showFlowerBubble = false;
    this.showButterflyBubble = false;

    const audioUrl = this.scenesConfig[this.currentScene]?.rabbitAudioUrl;
    if (audioUrl) {
      this.playSound(audioUrl);
    }

    setTimeout(() => (this.showRabbitBubble = false), 2000);
  }

  // Tương tác chạm vào Hoa
  playFlowerSound() {
    this.showFlowerBubble = true;
    this.showRabbitBubble = false;
    this.showButterflyBubble = false;

    const audioUrl = this.scenesConfig[this.currentScene]?.flowerAudioUrl;
    if (audioUrl) {
      this.playSound(audioUrl);
    }

    setTimeout(() => (this.showFlowerBubble = false), 2000);
  }

  // Tương tác chạm vào Bướm
  playButterflySound() {
    this.showButterflyBubble = true;
    this.showRabbitBubble = false;
    this.showFlowerBubble = false;

    const audioUrl = this.scenesConfig[this.currentScene]?.butterflyAudioUrl;
    if (audioUrl) {
      this.playSound(audioUrl);
    }

    setTimeout(() => (this.showButterflyBubble = false), 2000);
  }

  // Hàm helper tổng hợp phát file Audio chung, tự động dừng âm thanh cũ tránh đè tiếng
  private playSound(url: string) {
    try {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
      this.currentAudio = new Audio(url);
      this.currentAudio.play().catch((err) => {
        console.warn('Không thể tự động phát âm thanh do chính sách trình duyệt:', err);
      });
    } catch (e) {
      console.error('Lỗi phát âm thanh:', e);
    }
  }

  // Hoàn thành trò chơi bắn pháo hoa tưng bừng
  finishGame() {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  }
}