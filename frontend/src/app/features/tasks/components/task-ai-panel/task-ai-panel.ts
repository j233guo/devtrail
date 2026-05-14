import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-ai-panel',
  imports: [FormsModule],
  templateUrl: './task-ai-panel.html',
  styleUrl: './task-ai-panel.scss',
})
export class TaskAiPanelComponent {
  protected readonly selectedModel = signal('DeepSeek Chat');
  protected readonly selectedAction = signal<string | null>(null);
  protected readonly modelOptions = [
    'DeepSeek Chat',
    'DeepSeek Reasoner',
    'Future: Ollama',
    'Future: Google',
    'Future: OpenAI',
  ];
  protected readonly actions = [
    'Generate Task Plan',
    'Generate AI Coding Prompt',
    'Generate Commit Message',
  ];

  protected updateModel(value: string): void {
    this.selectedModel.set(value);
  }

  protected chooseAction(action: string): void {
    this.selectedAction.set(action);
  }
}
