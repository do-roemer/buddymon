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
   cd ${CLAUDE_PLUGIN_ROOT}/../.. && npm run buddymon -- buddy {{ARGS}}
   ```

4. **Determine the body type.** The fighter card has a `bodyType` field that is either `"biped"` or `"quadruped"`. Read the card output from step 3 to find this value.

   - **Biped**: standing upright on two legs (head centered ABOVE body)
   - **Quadruped**: on all fours like a cow or horse (head placed to the LEFT of body, side by side)

5. **Generate a custom body sprite** based on the fighter's traits AND body type. The species head (hat + face, 5 lines) is always rendered from the template. You only generate the BODY that the renderer attaches to the head.

   Read the output from step 3 and use the class, stats, rarity, personality, and body type to design a unique body.

   **The species head is already provided (~12 chars wide) — for example a capybara looks like:**
   ```
      \^^^/       <- hat (automatic)
     n______n     <- top of head (automatic)
    ( °    ° )    <- eyes (automatic)
    (   oo   )    <- mouth (automatic)
     `------´     <- chin (automatic)
   ```

   ---

   ### BIPED body (bodyType = "biped")

   **You generate 7 to 9 body lines that go BELOW the head.** The body is WIDER than the head (~22 chars vs ~12 chars). The renderer automatically centers the narrower head above the wider body, so the final result looks like:
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

   **Biped body rules:**
   - 7 to 9 lines total (body + legs)
   - Each line exactly 22 characters wide (pad with spaces)
   - Use only ASCII printable characters
   - The body should connect visually to the chin/bottom of the head above it
   - Use the extra width (~5 chars on each side beyond the head) for arms, held items, weapons, wings, capes, or effects extending outward
   - The body gives the buddymon a FULL character appearance — torso, arms, held items, legs, feet, tail

   ---

   ### QUADRUPED body (bodyType = "quadruped")

   **You generate 5 to 7 body lines that go to the RIGHT of the head.** The head is placed on the LEFT side (the "front" of the animal) and the body extends to the right. The renderer places them side by side, vertically centered:
   ```
                  ___=========___      <- body line (you design these)
      \^^^/      /               \     <- hat aligns with body top
     n______n   |    .=======.    |    <- head lines align with body
    ( °    ° )--|    |[++][++]|   |    <- connection from head to body
    (   oo   )  |    `========´   |    <- mouth level
     `------´    \_______________/     <- chin level
                   ||  ||  ||  ||      <- four legs below
   ```

   **Quadruped body rules:**
   - 5 to 7 lines total (torso + legs)
   - Each line exactly 22 characters wide (pad with spaces on the RIGHT only)
   - **NO leading whitespace** — body content must start at column 0 (the renderer right-aligns the head to connect flush)
   - Use only ASCII printable characters
   - The LEFT edge of the body lines should connect visually to the RIGHT side of the head (where the neck meets the torso)
   - Line 0 of the body aligns with the head's hat line — use this for the back/top of the body
   - The body represents a horizontal torso with four legs underneath
   - Include a tail, saddle, armor, or accessories on the back/rear
   - Legs go at the bottom — typically 4 legs (front pair + back pair)

   **Quadruped body design tips:**
   - Start the first body line with a neck connector like `--`, `~~`, or `\ ` to visually join the head
   - The torso is wider horizontally: show a broad back and belly
   - Put legs in the last 1-2 lines: `||  ||` or `/|  |\` for four legs
   - Tails extend from the right side: `~`, `>`, or curled shapes
   - Gear sits ON the back: saddles `[==]`, backpacks, armor plates

   ---

   **Trait-based body design — apply ALL that match (both biped and quadruped):**

   *Class determines the overall theme:*
   - **Explorer**: adventurer gear, spyglass or compass in hand, backpack, hiking boots (quadruped: saddlebags, compass hanging from neck)
   - **Builder**: tool belt, hammer or wrench in hand, work apron, sturdy boots (quadruped: tool harness, gear strapped to back)
   - **Commander**: sword or terminal prompt, military cape, armored boots (quadruped: war armor, banner on back, armored hooves)
   - **Architect**: blueprints or ruler, scholarly robes, neat shoes (quadruped: scroll saddlebag, blueprint draped over back)
   - **Debugger**: magnifying glass or bug net, lab coat, utility boots (quadruped: bug net on back, magnifying glass on harness)

   *Stats modify the body shape and details:*
   - **High ATK (>60)**: spiked shoulders/flanks, claws, weapons, aggressive stance
   - **High DEF (>60)**: heavy armor plates `[=]`, shield on arm/flank, thick body
   - **High SPD (>60)**: lean body, speed lines `~`, small wings, light feet/hooves
   - **High HP (>200)**: wider/bulkier torso, bigger overall frame
   - **Rage mode ON**: flames around body (`*`, `~`), aggressive posture, fire trail from feet/hooves
   - **Shiny**: sparkle characters (`+`, `*`) on body
   - **Rare/Epic/Legendary**: more ornate details, decorative patterns, capes/blankets, auras

   **Example BIPED bodies (head NOT included — these go below it):**

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

   **Example QUADRUPED bodies (head NOT included — these go to the RIGHT of it):**

   Explorer capybara (saddlebags, adventurer):
   ```
~/=============\~     
|  [bag] [bag] |      
|    .------.  |      
|    `------´  |      
\______________/      
 ||  ||    || ||      
_/|  |\   _/| |\     
   ```

   Commander dragon (war armor, banner):
   ```
~[==============]>>   
|##| .----. |##|      
|  | |<##>| |  |      
|  | `----´ |  |      
\__|________|__/      
 /|  /\  /\  |\      
|_| |__||__| |_|     
   ```

   Builder robot (tool harness):
   ```
~[=======/\=====]     
| [wrench]  |==|      
|  |      | |  |      
|__|______|_|__|      
 ||   ||   ||         
_/|  _/|  _/|        
   ```

   Debugger cat (lab coat harness, magnifying glass):
   ```
~\______________/     
|  {()}   .--. |      
|  ~~~~   |  | |      
\__|______|__|_/      
 ||  ||   ||  ||      
_/| _/|  _/| _/|     
   ```

6. Export the card with the custom body sprite and body type:
   ```bash
   cd ${CLAUDE_PLUGIN_ROOT}/../.. && npm run buddymon -- export --body-type "BODYTYPE" --sprite "LINE1\\nLINE2\\nLINE3\\nLINE4\\nLINE5\\nLINE6\\nLINE7" {{ARGS}}
   ```

   Replace `BODYTYPE` with either `biped` or `quadruped` (matching the card's bodyType).

   The `--sprite` flag accepts the body lines joined by literal `\n` (backslash + n). Only pass the body lines — the head is added automatically by the renderer.

   **Important**: Shell-escape the sprite string properly. Use double quotes around the whole value and escape any special shell characters (`\`, `"`, `` ` ``, `$`).

7. **Do NOT show the full assembled sprite (head + body) to the user.** The full body is a secret — it is only revealed in the arena after reaching level 25. Instead, tell the user their buddymon has been transformed and they can upload with `/buddymon upload`. You may hint that the full body will be revealed later as a reward.
