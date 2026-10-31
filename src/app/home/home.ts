import { Component, AfterViewInit, OnDestroy } from '@angular/core';
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
export class Home implements AfterViewInit, OnDestroy {
  currentScene = 0; // 0: Mở đầu, 1: Chặng 1, 2: Chặng 2, 3: Chặng 3

  showRabbitBubble = false;
  showFlowerBubble = false;
  showButterflyBubble = false;

  private currentAudio: HTMLAudioElement | null = null;

  // =========================================================================
  // BẢNG CẤU HÌNH TẬP TRUNG
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
    this.updateViewportHeight();
    window.addEventListener('resize', this.updateViewportHeight);
    window.addEventListener('orientationchange', this.updateViewportHeight);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateViewportHeight);
    window.removeEventListener('orientationchange', this.updateViewportHeight);
  }

  // Đo chiều cao thực tế chống tràn thanh địa chỉ mobile
  private updateViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  // Chuyển cảnh tức thì không giật lag
  goToScene(sceneIndex: number) {
    this.currentScene = sceneIndex;
    this.resetBubbles();

    // Phát âm thanh cốt truyện ngay khi chuyển cảnh
    setTimeout(() => {
      this.autoPlayNarration();
    }, 150);
  }

  resetBubbles() {
    this.showRabbitBubble = false;
    this.showFlowerBubble = false;
    this.showButterflyBubble = false;
  }

  autoPlayNarration() {
    const currentData = this.scenesConfig[this.currentScene];
    if (this.currentScene > 0 && currentData?.narrationAudioUrl) {
      this.playSound(currentData.narrationAudioUrl);
    }
  }

  playRabbitSound() {
    this.showRabbitBubble = true;
    this.showFlowerBubble = false;
    this.showButterflyBubble = false;

    const audioUrl = this.scenesConfig[this.currentScene]?.rabbitAudioUrl;
    if (audioUrl) this.playSound(audioUrl);

    setTimeout(() => (this.showRabbitBubble = false), 2000);
  }

  playFlowerSound() {
    this.showFlowerBubble = true;
    this.showRabbitBubble = false;
    this.showButterflyBubble = false;

    const audioUrl = this.scenesConfig[this.currentScene]?.flowerAudioUrl;
    if (audioUrl) this.playSound(audioUrl);

    setTimeout(() => (this.showFlowerBubble = false), 2000);
  }

  playButterflySound() {
    this.showButterflyBubble = true;
    this.showRabbitBubble = false;
    this.showFlowerBubble = false;

    const audioUrl = this.scenesConfig[this.currentScene]?.butterflyAudioUrl;
    if (audioUrl) this.playSound(audioUrl);

    setTimeout(() => (this.showButterflyBubble = false), 2000);
  }

  private playSound(url: string) {
    try {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }
      this.currentAudio = new Audio(url);
      this.currentAudio.play().catch((err) => {
        console.warn('Audio play blocked:', err);
      });
    } catch (e) {
      console.error('Lỗi phát âm thanh:', e);
    }
  }

  finishGame() {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  }
}