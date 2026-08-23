import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AgentCards } from './agent-cards/agent-cards';
import { RulesPanel } from './rules-panel/rules-panel';
import { GraphPanel } from './graph-panel/graph-panel';

/**
 * App shell: header + three sections (Agentes / Reglas / Grafo de delegación).
 * Single-page layout; routes stay empty and RouterOutlet remains for future pages.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AgentCards, RulesPanel, GraphPanel],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}