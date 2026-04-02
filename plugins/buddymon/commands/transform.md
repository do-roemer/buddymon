---
description: Transform your Claude Code buddy into a full-body buddymon with a custom sprite
---

# Transform Buddymon

Generate your fighter card and design a unique body based on your stats and class. This creates and exports your card locally — use `/buddymon upload` to send it to the arena.

## Instructions

1. Check if the Terminal Tamer name is set:
   ```bash
   cat ~/.config/buddymon/config.json 2>/dev/null
   ```
2. If no name is set, ask the user what name they'd like to use.

3. Run the **buddy** command to see the fighter's traits:
   ```bash
   cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- buddy {{ARGS}}
   ```

4. **Generate a custom body sprite** based on the fighter's traits. The species head (hat + face, 5 lines) is always rendered from the template. You only generate the BODY + LEGS that appear below it.

   Read the output from step 3 and use the class, stats, rarity, and personality to design a unique body.

   **The species head is already provided (~12 chars wide) — for example a capybara looks like:**
   ```
      \^^^/       <- hat (automatic)
     n______n     <- top of head (automatic)
    ( °    ° )    <- eyes (automatic)
    (   oo   )    <- mouth (automatic)
     `------´     <- chin (automatic)
   ```

   **You generate 7 to 9 body lines that go below this head.** The body is WIDER than the head (~22 chars vs ~12 chars). The renderer automatically centers the narrower head above the wider body, so the final result looks like:
   ```
        \^^^/              <- head auto-centered
       n______n            <- head auto-centered
      ( °    ° )           <- head auto-centered
      (   oo   )           <- head auto-centered
       `------´            <- head auto-centered
       |      |            <- body line (you design these)
  ?~> /| .--. |\           <- arms extend beyond head width
     | | [++] | |          <- torso with details
     ...
   ```

   **Body rules:**
   - 7 to 9 lines total (body + legs)
   - Each line exactly 22 characters wide (pad with spaces)
   - Use only ASCII printable characters
   - The body should connect visually to the chin/bottom of the head above it
   - Use the extra width (~5 chars on each side beyond the head) for arms, held items, weapons, wings, capes, or effects extending outward
   - The body gives the buddymon a FULL character appearance — torso, arms, held items, legs, feet, tail

   **Trait-based body design — apply ALL that match:**

   *Class determines the overall theme:*
   - **Explorer**: adventurer gear, spyglass or compass in hand, backpack, hiking boots
   - **Builder**: tool belt, hammer or wrench in hand, work apron, sturdy boots
   - **Commander**: sword or terminal prompt, military cape, armored boots
   - **Architect**: blueprints or ruler, scholarly robes, neat shoes
   - **Debugger**: magnifying glass or bug net, lab coat, utility boots

   *Stats modify the body shape and details:*
   - **High ATK (>60)**: spiked shoulders, claws, weapons, aggressive stance
   - **High DEF (>60)**: heavy armor plates `[=]`, shield on arm, thick body
   - **High SPD (>60)**: lean body, speed lines `~`, small wings, light feet
   - **High HP (>200)**: wider/bulkier torso, bigger overall frame
   - **Rage mode ON**: flames around body (`*`, `~`), aggressive posture, fire trail from feet
   - **Shiny**: sparkle characters (`+`, `*`) on body
   - **Rare/Epic/Legendary**: more ornate details, decorative patterns, capes, auras

   **Example bodies (head NOT included — these go below it):**

   Explorer capybara (adventurer, high ATK, spyglass):
   ```
       |      |       
  ?~> /| .--. |\      
     | | [++] | |     
     | |_\__/_| |     
     |_|      |_|     
      |   ||   |      
      |   ||   |      
     _/   /\   \_     
   ```

   Builder robot (sturdy, high DEF, tool belt):
   ```
  ==/|  [======]  |\  
     |  |      |  |   
     |  |[====]|  |   
     |__|      |__|   
      /|        |\    
      | |      | |    
      |_|      |_|    
   ```

   Commander dragon (high ATK, sword, cape):
   ```
  *~\|^^      ^^|/~* 
    \|   /==\   |/>= 
     |   |  |   |    
     |___|  |___|    
    /===|    |===\   
    |   |    |   |   
    |^^^|    |^^^|   
   ```

   Debugger axolotl (lab coat, magnifying glass):
   ```
   {|            |}   
    |   .----.   |    
    |   | () |   |    
    |___|    |___|    
      |        |      
      |        |      
     _/        \_     
   ```

5. Export the card with the custom body sprite:
   ```bash
   cd ~/Desktop/personal_projects/buddymon && npm run buddymon -- export --sprite "LINE1\\nLINE2\\nLINE3\\nLINE4\\nLINE5\\nLINE6\\nLINE7" {{ARGS}}
   ```

   The `--sprite` flag accepts the body lines joined by literal `\n` (backslash + n). Only pass the body lines — the head is added automatically by the renderer.

   **Important**: Shell-escape the sprite string properly. Use double quotes around the whole value and escape any special shell characters (`\`, `"`, `` ` ``, `$`).

6. Show the full ASCII sprite (head + body) to the user and let them know they can upload with `/buddymon upload`.
