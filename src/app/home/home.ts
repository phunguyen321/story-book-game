import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';

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

  ngAfterViewInit() {
    this.autoPlayNarration();
  }

  // Chuyển đổi cảnh truyện kèm reset trạng thái bong bóng
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

  // Tự động đọc lời kể cốt truyện khi chuyển cảnh
  autoPlayNarration() {
    const texts = [
      "",
      "Thỏ Con đi chơi. Thỏ đi, thỏ đi!",
      "Ó! Bông hoa đẹp quá! Hoa, hoa!",
      "Bướm bay! Bướm bay! Thỏ chào bướm nhé!"
    ];

    if (this.currentScene > 0) {
      this.speakText(texts[this.currentScene], 0.9);
    }
  }

  // Tương tác chạm vào Thỏ
  playRabbitSound() {
    this.showRabbitBubble = true;
    this.showFlowerBubble = false;
    this.showButterflyBubble = false;

    this.speakText("Thỏ! Thỏ!", 1.1);

    setTimeout(() => this.showRabbitBubble = false, 2000);
  }

  // Tương tác chạm vào Hoa
  playFlowerSound() {
    this.showFlowerBubble = true;
    this.showRabbitBubble = false;
    this.showButterflyBubble = false;

    this.speakText("Hoa! Hoa!", 1.0);

    setTimeout(() => this.showFlowerBubble = false, 2000);
  }

  // Tương tác chạm vào Bướm
  playButterflySound() {
    this.showButterflyBubble = true;
    this.showRabbitBubble = false;
    this.showFlowerBubble = false;

    this.speakText("Bướm! Bướm!", 1.0);

    setTimeout(() => this.showButterflyBubble = false, 2000);
  }

  // Hàm tổng hợp Web Speech API phát âm tiếng Việt
  speakText(text: string, rate: number) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    }
  }

  // Hoàn thành trò chơi bắn pháo hoa tưng bừng
  finishGame() {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
    this.speakText("Bé giỏi quá! Trò chơi kết thúc rồi.", 0.9);
  }
}