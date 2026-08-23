import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { AgentCards } from './agent-cards/agent-cards';
import { RulesPanel } from './rules-panel/rules-panel';
import { ConstructorPanel } from './constructor-panel/constructor-panel';
import { PipelinePanel } from './pipeline-panel/pipeline-panel';

/**
 * App shell: header + four Angular Material tabs
 * (Agentes / Reglas / Constructor / Pipeline). Single-page layout; routes stay
 * empty and RouterOutlet remains below the tabs for future pages.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatTabsModule, AgentCards, RulesPanel, ConstructorPanel, PipelinePanel],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css',
})
export class App {}