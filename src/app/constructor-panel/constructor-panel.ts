import {
  Component,
  ChangeDetectionStrategy,
  computed,
  signal,
  type WritableSignal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

/**
 * Builder MVP: draft new agent definitions (.md) from opinionated archetype
 * templates, preview the generated markdown live, and download it as a file.
 *
 * State ownership is signal-based (per the Phase 2 Reduce decision): the draft
 * fields are writable signals and the preview is a computed signal, so the
 * NgxGraph dependency stays out of this bundle and the preview updates
 * zonelessly. No new external libraries were added.
 */
@Component({
  selector: 'app-constructor-panel',
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './constructor-panel.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './constructor-panel.css',
})
export class ConstructorPanel {
  /** Selected archetype — drives which base template is prefilled. */
  readonly archetype = signal<Archetype>('delivery');

  /** Explorer objective (only shown when archetype === 'explorer'). */
  readonly objective = signal('codebase exploration');

  /** Coder language/stack (only shown when archetype === 'coder'). */
  readonly language = signal('Angular');

  /** Editable draft fields; prefilled from the archetype template. */
  readonly fields: Record<ConstructorField, WritableSignal<string>> = {
    id: signal(DELIVERY_TEMPLATE.id),
    displayName: signal(DELIVERY_TEMPLATE.displayName),
    role: signal(DELIVERY_TEMPLATE.role),
    group: signal(DELIVERY_TEMPLATE.group),
    model: signal(DELIVERY_TEMPLATE.model),
    temperature: signal(DELIVERY_TEMPLATE.temperature),
    mode: signal(DELIVERY_TEMPLATE.mode),
    permission: signal(DELIVERY_TEMPLATE.permission),
    essence: signal(DELIVERY_TEMPLATE.essence),
    specificBeyondGeneral: signal(DELIVERY_TEMPLATE.specificBeyondGeneral),
    relatedFiles: signal(DELIVERY_TEMPLATE.relatedFiles),
  };

  /**
   * Live .md generation: YAML frontmatter + markdown body mirroring the
   * .opencode/agents/subagents/*.md structure. Recomputes whenever any field
   * signal changes.
   */
  readonly mdPreview = computed(() => buildMarkdown(this.fields));

  /** Archetype selector change — prefill the opinionated base template. */
  onArchetypeChange(value: string): void {
    const archetype = value as Archetype;
    this.archetype.set(archetype);
    this.applyArchetype(archetype);
  }

  /** Explorer objective change — only role/essence/specificBeyondGeneral vary. */
  onObjectiveChange(value: string): void {
    this.objective.set(value);
    if (this.archetype() === 'explorer') {
      const template = explorerTemplate(value);
      this.fields.role.set(template.role);
      this.fields.essence.set(template.essence);
      this.fields.specificBeyondGeneral.set(template.specificBeyondGeneral);
    }
  }

  /** Coder language change — role/model (plus language-derived id/displayName/permission). */
  onLanguageChange(value: string): void {
    this.language.set(value);
    if (this.archetype() === 'coder') {
      this.fillTemplate(coderTemplate(value));
    }
  }

  /** Input/textarea handler — writes the typed value into the field signal. */
  onFieldInput(field: ConstructorField, event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.fields[field].set(target.value);
  }

  /** Select handler — writes the selected option value into the field signal. */
  setFieldValue(field: ConstructorField, value: string): void {
    this.fields[field].set(value);
  }

  /**
   * Download the generated .md as a Blob (browser-side, no backend). Filename
   * follows the agent id (kebab-case) + `.md`, matching the subagent file
   * naming convention.
   */
  downloadMd(): void {
    const filename = `${sanitizeId(this.fields.id())}.md`;
    const blob = new Blob([this.mdPreview()], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    // Append to the DOM so Firefox treats the click as a real navigation, then
    // remove it right after. Revoking the object URL is deferred — a
    // synchronous revoke can abort the download in Firefox.
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  private applyArchetype(archetype: Archetype): void {
    switch (archetype) {
      case 'delivery':
        this.fillTemplate(DELIVERY_TEMPLATE);
        break;
      case 'orchestrator':
        this.fillTemplate(ORCHESTRATOR_TEMPLATE);
        break;
      case 'interpreter':
        this.fillTemplate(INTERPRETER_TEMPLATE);
        break;
      case 'explorer':
        this.fillTemplate(explorerTemplate(this.objective()));
        break;
      case 'coder':
        this.fillTemplate(coderTemplate(this.language()));
        break;
    }
  }

  private fillTemplate(template: AgentTemplate): void {
    this.fields.id.set(template.id);
    this.fields.displayName.set(template.displayName);
    this.fields.role.set(template.role);
    this.fields.group.set(template.group);
    this.fields.model.set(template.model);
    this.fields.temperature.set(template.temperature);
    this.fields.mode.set(template.mode);
    this.fields.permission.set(template.permission);
    this.fields.essence.set(template.essence);
    this.fields.specificBeyondGeneral.set(template.specificBeyondGeneral);
    this.fields.relatedFiles.set(template.relatedFiles);
  }
}

/** Archetypes the constructor can prefill, mirroring .opencode/agents/subagents/*.md. */
export type Archetype = 'delivery' | 'orchestrator' | 'interpreter' | 'explorer' | 'coder';

/** Form field keys — each maps to a writable signal in `fields`. */
export type ConstructorField =
  | 'id'
  | 'displayName'
  | 'role'
  | 'group'
  | 'model'
  | 'temperature'
  | 'mode'
  | 'permission'
  | 'essence'
  | 'specificBeyondGeneral'
  | 'relatedFiles';

/** Opinionated base template derived from the real subagent frontmatter. */
export interface AgentTemplate {
  id: string;
  displayName: string;
  role: string;
  group: string;
  model: string;
  temperature: string;
  mode: string;
  permission: string;
  essence: string;
  specificBeyondGeneral: string;
  relatedFiles: string;
}

/** Delivery — the only primary agent; sole human↔agent interface. */
const DELIVERY_TEMPLATE: AgentTemplate = {
  id: 'delivery',
  displayName: 'Delivery',
  role: 'Sole human ↔ agent interface; translates, routes, delegates — never implements',
  group: 'coordination',
  model: 'opencode-go/deepseek-v4-flash',
  temperature: '0.3',
  mode: 'primary',
  permission: `webfetch: deny
task:
  interpreter: allow
  orchestrator: allow
  coder: allow
  tester: allow
  reviewer: allow
  architect: allow
  explorer: allow
  project-context: allow
  external-scout: allow
  analista: allow
  documenter: allow`,
  essence:
    'Translator and router between the human and the agent network. Reads and writes docs directly when the task is pure docs; delegates ALL technical work through the task tool. Never implements.',
  specificBeyondGeneral:
    'Delivery carries the highest cost-of-error in the system: a wrong inference propagates to every downstream subagent. The interpreter-first hard gate and the "never do it yourself" rule are load-bearing; doing the work in the delivery tier is the exact failure mode this prompt exists to prevent.',
  relatedFiles:
    '.opencode/agents/subagents/delivery.md, .opencode/workflows/dispatch.md, .opencode/protocols/prompt-pipeline.md, docs/project.md',
};

/** Orchestrator — persistent coordinator; sole executor of Phase 2 (Reduce). */
const ORCHESTRATOR_TEMPLATE: AgentTemplate = {
  id: 'orchestrator',
  displayName: 'Orchestrator',
  role: 'Persistent coordinator; Phase 2 Reduce, fan-out, aggregation',
  group: 'coordination',
  model: 'inherit',
  temperature: '0.2',
  mode: 'subagent',
  permission: `task:
  interpreter: allow
  coder: allow
  tester: allow
  reviewer: allow
  architect: allow
  explorer: allow
  project-context: allow
  external-scout: allow
  analista: allow
  documenter: allow`,
  essence:
    'Sole executor of Phase 2 (Reduce). Decomposes handoffs into subagent work units, releases them in parallel (cross-type and same-type fan-out), aggregates structured returns, and produces an agent-snapshot.',
  specificBeyondGeneral:
    'Persistent across delegations: receives the handoff once, maintains state, and never owns the human conversation. Context budget and cheap-tier cost discipline are binding; escalating the model by default is the failure mode.',
  relatedFiles:
    '.opencode/agents/subagents/orchestrator.md, .opencode/workflows/orchestrate.md, docs/project.md, docs/context/README.md',
};

/** Interpreter — Step 0 normalization helper invoked on every prompt. */
const INTERPRETER_TEMPLATE: AgentTemplate = {
  id: 'interpreter',
  displayName: 'Interpreter',
  role: 'Step 0 normalization; vocabulary reconciliation → routing packet',
  group: 'analysis',
  model: 'inherit',
  temperature: '0.1',
  mode: 'subagent',
  permission: `edit: deny
bash: deny
task:
  interpreter: allow`,
  essence:
    'Tiny pre-routing helper invoked by delivery as Step 0 on every prompt. Normalizes the raw prompt, reconciles vocabulary via grep/glob against repo docs, captures constraints, and returns a compact routing packet.',
  specificBeyondGeneral:
    'Never answers the request itself — the routing packet is the only output. The interpreter-first hard gate is load-bearing: skipping Step 0 for "trivial" prompts is the failure mode this seat exists to prevent.',
  relatedFiles:
    '.opencode/agents/subagents/interpreter.md, .opencode/protocols/prompt-pipeline.md, docs/project.md',
};

/** Explorer base shared by all objective variants. */
const EXPLORER_BASE: Omit<AgentTemplate, 'role' | 'essence' | 'specificBeyondGeneral'> = {
  id: 'explorer',
  displayName: 'Explorer',
  group: 'exploration',
  model: 'inherit',
  temperature: '0.1',
  mode: 'subagent',
  permission: `edit: deny
task:
  explorer: allow`,
  relatedFiles:
    '.opencode/agents/subagents/explorer.md, docs/project.md, docs/context/architecture.md',
};

/** Explorer objective variants — only role/essence/specificBeyondGeneral differ. */
const EXPLORER_VARIANTS: Record<string, Pick<AgentTemplate, 'role' | 'essence' | 'specificBeyondGeneral'>> = {
  'codebase exploration': {
    role: 'Codebase exploration — read-only mapping, inventory, and audit of a class of thing across the repo',
    essence:
      'Read-only codebase exploration, file search, and dependency analysis. Finds and reports; never modifies. Returns structured ExplorerOutput JSON.',
    specificBeyondGeneral:
      'Recursive fan-out (SAMPLE_WINDOW=10, CHUNK_SIZE=20, MAX_DEPTH=3) when the input exceeds the sample window; targeted lookups stay single-pass.',
  },
  'file search': {
    role: 'File search — locate symbols and files via grep/glob',
    essence:
      'Read-only finder that answers targeted lookups: "where is X defined?", "what imports Y?", "does Z handle the empty-array case?". Single-pass; never modify.',
    specificBeyondGeneral:
      'Targeted lookups stay single-pass — fanning out on a one-grep question is the anti-pattern. Report paths relative to the repo root so the caller can open files directly.',
  },
  'dependency analysis': {
    role: 'Dependency analysis — import graph, cyclic deps, package usage',
    essence:
      'Read-only dependency mapping: import graph, cyclic dependencies, package usage, and boundary violations across the repo.',
    specificBeyondGeneral:
      'Cross-cutting answers (e.g. "find all cyclic dependencies") must be processed with the whole picture — fan-out loses the cross-file view. Report paths relative to the repo root.',
  },
  'general reconnaissance': {
    role: 'General reconnaissance — broad read-only investigation of an unknown area',
    essence:
      'Read-only reconnaissance of an unfamiliar area: map the shape, naming conventions, patterns, and typical file sizes before deeper work.',
    specificBeyondGeneral:
      'When coverage matters (map / inventory / audit), follow the broad-investigation-template and say explicitly when candidates could not be enumerated — never guess coverage.',
  },
};

function explorerTemplate(objective: string): AgentTemplate {
  const variant = EXPLORER_VARIANTS[objective] ?? EXPLORER_VARIANTS['codebase exploration'];
  return { ...EXPLORER_BASE, ...variant };
}

/** Coder base shared by all language variants. */
const CODER_BASE: Omit<AgentTemplate, 'id' | 'displayName' | 'role' | 'model' | 'permission' | 'essence' | 'relatedFiles'> = {
  group: 'coders',
  temperature: '0.1',
  mode: 'subagent',
  specificBeyondGeneral:
    'Thin adapter: never mimic legacy src/ anti-patterns — docs/context/*.md are the source of truth. Run the canonical test/lint/build commands from docs/project.md before reporting done.',
};

/** Coder language variants — role/model (plus permission/essence/relatedFiles) change per stack. */
const CODER_VARIANTS: Record<
  string,
  Pick<AgentTemplate, 'id' | 'displayName' | 'role' | 'model' | 'permission' | 'essence' | 'relatedFiles'>
> = {
  Angular: {
    id: 'coder',
    displayName: 'Coder',
    role: 'Angular 22 SPA implementation specialist (language=angular)',
    model: 'opencode-go/deepseek-v4-flash',
    permission: `task:
  coder: allow`,
    essence:
      'Thin adapter: reads the Angular docs in docs/context/ and the matched slice, applies them, returns CoderOutput JSON. Branches by language=angular.',
    relatedFiles:
      '.opencode/agents/subagents/coder.md, .opencode/agents/subagents/coder.schema.json, docs/context/architecture.md, docs/context/project-rules.md',
  },
  Go: {
    id: 'coder',
    displayName: 'Coder',
    role: 'Go 1.24 API implementation specialist (language=go)',
    model: 'opencode-go/deepseek-v4-flash',
    permission: `task:
  coder: allow`,
    essence:
      'Thin adapter: reads the Go docs in docs/context/ and the matched slice, applies them, returns CoderOutput JSON. Branches by language=go.',
    relatedFiles:
      '.opencode/agents/subagents/coder.md, .opencode/agents/subagents/coder.schema.json, docs/context/architecture.md, backend/docs/project.md',
  },
  TypeScript: {
    id: 'coder',
    displayName: 'Coder',
    role: 'TypeScript implementation specialist (language=typescript)',
    model: 'inherit',
    permission: `task:
  coder: allow`,
    essence:
      'Thin adapter: reads the docs in docs/context/ and the matched slice, applies them, returns CoderOutput JSON.',
    relatedFiles:
      '.opencode/agents/subagents/coder.md, docs/context/architecture.md, docs/context/project-rules.md',
  },
  Python: {
    id: 'coder',
    displayName: 'Coder',
    role: 'Python implementation specialist (language=python)',
    model: 'inherit',
    permission: `task:
  coder: allow`,
    essence:
      'Thin adapter: reads the docs in docs/context/ and the matched slice, applies them, returns CoderOutput JSON.',
    relatedFiles:
      '.opencode/agents/subagents/coder.md, docs/context/architecture.md, docs/context/project-rules.md',
  },
};

function coderTemplate(language: string): AgentTemplate {
  const variant = CODER_VARIANTS[language] ?? CODER_VARIANTS['Angular'];
  return { ...CODER_BASE, ...variant };
}

/**
 * Normalize a raw agent id to kebab-case: lower-case, non-alphanumeric
 * characters become hyphens, consecutive hyphens collapse, and leading/trailing
 * hyphens are trimmed. Falls back to 'agent' when nothing usable remains.
 */
function sanitizeId(raw: string): string {
  const base = raw.trim().toLowerCase() || 'agent';
  return (
    base
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'agent'
  );
}

/**
 * Build the generated .md: YAML frontmatter (id, displayName, description,
 * mode, model, temperature, permission) + markdown body (Role, Essence,
 * Specific beyond general, Related files) — mirroring the subagent file shape.
 */
function buildMarkdown(fields: Record<ConstructorField, WritableSignal<string>>): string {
  const id = sanitizeId(fields.id());
  const displayName = fields.displayName().trim() || 'Agent';
  const role = fields.role().trim();
  const group = fields.group().trim();
  const model = fields.model().trim();
  const temperature = fields.temperature().trim();
  const mode = fields.mode().trim();
  const permission = fields.permission().trim();
  const essence = fields.essence().trim();
  const specific = fields.specificBeyondGeneral().trim();
  const related = fields.relatedFiles().trim();

  const frontmatter: string[] = [
    '---',
    `id: ${id}`,
    `displayName: ${displayName}`,
    `description: ${descriptionFor(displayName, role)}`,
  ];
  if (mode) frontmatter.push(`mode: ${mode}`);
  if (model) frontmatter.push(`model: ${model}`);
  if (temperature) frontmatter.push(`temperature: ${temperature}`);
  if (permission) frontmatter.push(yamlPermission(permission));
  frontmatter.push('---');

  const body: string[] = [`# ${displayName}`, '', '## Role', role || '—'];
  if (group) body.push('', `**Group:** ${group}`);
  if (essence) body.push('', '## Essence', essence);
  if (specific) body.push('', '## Specific beyond general', specific);
  if (related) {
    body.push('', '## Related files');
    for (const file of splitRelatedFiles(related)) {
      body.push(`- ${file}`);
    }
  }
  body.push('');

  return `${frontmatter.join('\n')}\n\n${body.join('\n')}`;
}

function descriptionFor(displayName: string, role: string): string {
  if (displayName && role) {
    return `${displayName} - ${role}`;
  }
  return displayName || role || 'Agent definition';
}

/** Render the permission block as YAML nested under the `permission:` key. */
function yamlPermission(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('permission:')) {
    return trimmed;
  }
  return `permission:\n${indent(trimmed, 2)}`;
}

function indent(value: string, spaces: number): string {
  const pad = ' '.repeat(spaces);
  return value
    .split('\n')
    .map((line) => pad + line)
    .join('\n');
}

/** Split comma/newline-separated related files into trimmed non-empty paths. */
function splitRelatedFiles(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((file) => file.trim())
    .filter((file) => file.length > 0);
}