"use client";

import { delftTexts as t } from "@/content/delft";
import { CODE_LENGTH } from "@/game/finale";

interface Props {
  code: string;
  /** Uit tijdens een reactie van Sinterklaas. */
  disabled: boolean;
  /** Verandert bij elke foute code: de vakjes schudden. */
  shakeKey: number;
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

/**
 * Het codeslot: vier vakjes, een schermtoetsenbord en de knop "Ontgrendel de poort".
 * Toont nooit iets over de juiste code. Toetsenbord (cijfers, Backspace, Enter)
 * wordt in DelftScene afgehandeld.
 */
export default function CodeLock({ code, disabled, shakeKey, onDigit, onBackspace, onSubmit }: Props) {
  const complete = code.length === CODE_LENGTH;
  return (
    <div className="lock-layer">
      <div className="lock-panel" role="group" aria-label={t.lockTitle}>
        <p className="lock-title">{t.lockTitle}</p>
        <div key={shakeKey} className={shakeKey > 0 ? "lock-fields lock-shake" : "lock-fields"}>
          {Array.from({ length: CODE_LENGTH }, (_, i) => (
            <div
              key={i}
              className={i === code.length && !disabled ? "lock-field is-next" : "lock-field"}
              role="img"
              aria-label={t.lockFieldLabel(i + 1)}
            >
              {code[i] ?? ""}
            </div>
          ))}
        </div>
        <div className="lock-keys">
          {KEYS.map((k) => (
            <button key={k} className="lock-key" disabled={disabled || code.length >= CODE_LENGTH} onClick={() => onDigit(k)}>
              {k}
            </button>
          ))}
          <button className="lock-key lock-key-del" disabled={disabled || code.length === 0} onClick={onBackspace} aria-label={t.keypadDelete}>
            ⌫
          </button>
        </div>
        <button className="btn btn-primary lock-go" disabled={disabled || !complete} onClick={onSubmit}>
          {t.lockButton}
        </button>
      </div>
    </div>
  );
}
