import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  currentScene = 0; // 0: Mở đầu, 1: Cảnh 1, 2: Cảnh 2, 3: Cảnh 3

  showRabbitBubble = false;
  showFlowerBubble = false;
  showButterflyBubble = false;

  @ViewChild('rabbit') rabbit!: ElementRef;
  @ViewChild('flower') flower!: ElementRef;
  @ViewChild('butterfly') butterfly!: ElementRef;

  ngAfterViewInit() {
    this.autoPlayNarration();
  }

  // Chuyển cảnh và tự động đọc lời kể
  goToScene(sceneIndex: number) {
    this.currentScene = sceneIndex;
    this.resetBubbles();

    // Đợi DOM render xong cảnh mới rồi chạy hiệu ứng âm thanh/lời thoại
    setTimeout(() => {
      this.autoPlayNarration();
    }, 300);
  }

  resetBubbles() {
    this.showRabbitBubble = false;
    this.showFlowerBubble = false;
    this.showButterflyBubble = false;
  }

  // Tự động phát âm thanh lời kể tương ứng theo cảnh
  autoPlayNarration() {
    const texts = [
      "",
      "Thỏ Con đi chơi. Thỏ đi, thỏ đi!",
      "Ó! Bông hoa đẹp quá! Hoa, hoa!",
      "Bướm bay! Bướm bay! Thỏ chào bướm nhé!"
    ];

    if (this.currentScene > 0 && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Dừng câu trước nếu có
      const utterance = new SpeechSynthesisUtterance(texts[this.currentScene]);
      utterance.lang = 'vi-VN'; // Giọng đọc tiếng Việt chuẩn
      utterance.rate = 0.9;     // Nói chậm lại cho bé dễ nghe
      window.speechSynthesis.speak(utterance);
    }
  }

  // HÀNH ĐỘNG 1: Chạm vào Thỏ (Nhún nhảy bằng GSAP)
  playRabbitSound() {
    this.showRabbitBubble = true;
    this.speakText("Thỏ! Thỏ!");

    if (this.rabbit) {
      gsap.to(this.rabbit.nativeElement, {
        scaleY: 1.2,
        scaleX: 0.9,
        y: -30,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power1.out"
      });
    }
  }

  // HÀNH ĐỘNG 2: Chạm vào Hoa (Đung đưa qua lại bằng GSAP)
  playFlowerSound() {
    this.showFlowerBubble = true;
    this.speakText("Hoa! Hoa!");

    if (this.flower) {
      gsap.to(this.flower.nativeElement, {
        rotation: 15,
        duration: 0.15,
        yoyo: true,
        repeat: 3,
        ease: "sine.inOut",
        onComplete: () => {
          gsap.to(this.flower.nativeElement, { rotation: 0 });
        }
      });
    }
  }

  // HÀNH ĐỘNG 3: Chạm vào Bướm (Vỗ cánh bay lượn bằng GSAP)
  playButterflySound() {
    this.showButterflyBubble = true;
    this.speakText("Bướm! Bướm!");

    if (this.butterfly) {
      gsap.to(this.butterfly.nativeElement, {
        x: "+=50",
        y: "-=40",
        scaleX: -1,
        duration: 0.4,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut"
      });
    }
  }

  // Phát âm thanh tên nhân vật khi bé chạm
  speakText(text: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
    }
  }

  // Khi bấm Kết thúc -> Bắn pháo hoa giấy chúc mừng bé
  finishGame() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    this.speakText("Bé giỏi quá! Trò chơi kết thúc rồi.");
  }
}
