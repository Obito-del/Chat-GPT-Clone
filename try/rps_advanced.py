import random
from dataclasses import dataclass, field
from collections import Counter

MOVES = ("rock", "paper", "scissors")

# move -> what it beats
BEATS = {
    "rock": "scissors",
    "paper": "rock",
    "scissors": "paper",
}

def normalize_move(raw: str) -> str | None:
    raw = raw.strip().lower()
    shortcuts = {"r": "rock", "p": "paper", "s": "scissors"}
    raw = shortcuts.get(raw, raw)
    return raw if raw in MOVES else None

def winner(player: str, cpu: str) -> str:
    """Return 'player', 'cpu', or 'tie'."""
    if player == cpu:
        return "tie"
    return "player" if BEATS[player] == cpu else "cpu"

def counter_move(move: str) -> str:
    """Return the move that beats `move`."""
    for m, beats in BEATS.items():
        if beats == move:
            return m
    raise ValueError("Invalid move")

@dataclass
class Stats:
    rounds: int = 0
    player_wins: int = 0
    cpu_wins: int = 0
    ties: int = 0
    player_moves: Counter = field(default_factory=Counter)

    def record(self, player_move: str, result: str) -> None:
        self.rounds += 1
        self.player_moves[player_move] += 1
        if result == "player":
            self.player_wins += 1
        elif result == "cpu":
            self.cpu_wins += 1
        else:
            self.ties += 1

    def most_used(self) -> str | None:
        return self.player_moves.most_common(1)[0][0] if self.player_moves else None

    def win_rate(self) -> float:
        decided = self.player_wins + self.cpu_wins
        return (self.player_wins / decided) * 100 if decided else 0.0

def ai_choice(stats: Stats, mode: str) -> str:
    """
    mode:
      - random: always random
      - smart: predicts your most common move so far and counters it
    """
    if mode == "random" or stats.rounds < 3 or not stats.player_moves:
        return random.choice(MOVES)

    predicted = stats.most_used()
    return counter_move(predicted)

def play_match(best_of: int, mode: str) -> None:
    target = best_of // 2 + 1
    stats = Stats()

    print(f"\nBest of {best_of} (first to {target}). AI: {mode}\n")

    while stats.player_wins < target and stats.cpu_wins < target:
        raw = input("Your move (rock/paper/scissors or r/p/s). 'q' to quit match: ").strip().lower()
        if raw in ("q", "quit", "exit"):
            print("Match ended.\n")
            return

        player = normalize_move(raw)
        if not player:
            print("Invalid input. Try: rock/paper/scissors (or r/p/s).\n")
            continue

        cpu = ai_choice(stats, mode)
        result = winner(player, cpu)
        stats.record(player, result)

        if result == "player":
            msg = "You win this round."
        elif result == "cpu":
            msg = "Computer wins this round."
        else:
            msg = "This round is a tie."

        print(f"You: {player} | CPU: {cpu} -> {msg}")
        print(f"Score: You {stats.player_wins} - {stats.cpu_wins} CPU (ties: {stats.ties})\n")

    champ = "You" if stats.player_wins > stats.cpu_wins else "Computer"
    print("=== Match Over ===")
    print(f"Winner: {champ}")
    print(f"Rounds played: {stats.rounds}")
    print(f"Win rate (decided rounds): {stats.win_rate():.1f}%")
    if stats.most_used():
        print(f"Your most-used move: {stats.most_used()}")
    print()

def ask_best_of() -> int:
    while True:
        raw = input("Best of (odd number like 3,5,7) [default 5]: ").strip()
        if raw == "":
            return 5
        if raw.isdigit():
            n = int(raw)
            if n >= 1 and n % 2 == 1:
                return n
        print("Please enter an odd number (3, 5, 7, ...).")

def main():
    while True:
        print("Advanced Rock–Paper–Scissors")
        print("1) Play (smart AI)")
        print("2) Play (easy random AI)")
        print("3) Quit")

        choice = input("Choose: ").strip()
        if choice == "1":
            best_of = ask_best_of()
            play_match(best_of, mode="smart")
        elif choice == "2":
            best_of = ask_best_of()
            play_match(best_of, mode="random")
        elif choice == "3":
            print("Goodbye.")
            return
        else:
            print("Invalid option.\n")

if __name__ == "__main__":
    main()