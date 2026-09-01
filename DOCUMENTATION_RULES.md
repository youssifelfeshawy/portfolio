# Network Documentation Style Guide & Writing Rules

This document defines the core pedagogical philosophy, formatting rules, structural hierarchy, and command placement standards for all documentation in this project.

---

## 1. Pedagogical Mindset & "Learner-First" Flow

* **Introduce terms only when needed**: Every new concept or term must appear only when the reader actually needs it to understand the current step.
* **Complete explanations immediately**: Once a term is introduced, explain it fully on the spot. Never postpone definitions to later sections, and never forward-reference terms that have not yet been taught (e.g., do *not* mention "ephemeral range" in the definition of Source Port before the port ranges section has been introduced).
* **Layer-Appropriate Terminology**: Do not mention higher-layer protocols in early layers before they are formally introduced (e.g., say "generates a log message" instead of "Syslog alert" in Layer 2 Port Security, since Syslog is taught in Layer 7).
* **No premature examples**: Avoid cluttering basic definitions with examples if a dedicated reference table or in-depth subsection follows immediately below. Prioritize deep, thorough mechanical explanation over adding arbitrary examples.
* **No definition redundancy**: Do not provide parenthetical definitions for terms that were already established earlier in the document (e.g., do *not* write `hosts (computers and servers)` because "host" is already known).

---

## 2. Typography & Bolding Standards

* **NO mid-sentence bolding**: Do **not** bold random words, phrases, or protocol names in the middle of sentences or running body paragraphs.
  * ❌ *Incorrect:* `Layer 4 provides **process-to-process communication**, ensuring data reaches applications using **port numbers**.`
  * ❌ *Incorrect:* `...an event called **Tail Drop** which causes **TCP Global Synchronization**.`
  * ❌ *Incorrect:* `...the internet uses **RFC 1918 Private IP Addresses** inside networks.`
  * ✅ *Correct:* `Layer 4 provides process-to-process communication, ensuring data reaches applications using port numbers.`
  * ✅ *Correct:* `...an event called Tail Drop which causes TCP Global Synchronization.`
  * ✅ *Correct:* `...the internet uses RFC 1918 Private IP Addresses inside networks.`
* **Where bolding IS allowed**:
  1. List item titles / labels: `<li><strong>Source Port:</strong> A temporary port number...</li>`
  2. Table header cells: `<th>Port Range</th>`
  3. Table primary row keys: `<td><strong>Static NAT</strong></td>`

---

## 3. Eliminating Redundancy & Structuring Protocol Explanations

* **No summary paragraphs before bullet lists**: Do not write a paragraph summarizing 4 features and then immediately repeat those same 4 features in a bullet list right below. Write a single, clean introductory sentence that leads directly into the bullet list.
* **No artificial "Features Lists" for protocols**: When explaining transport or network protocols (like TCP or UDP), do not open with an artificial bullet list of features that repeats what the handshakes, header table, and operating mechanics will explain.
* **Structured Protocol Narrative Flow (TCP Standard)**:
  1. **Intro & Reliability**: Describe the protocol, its connection-oriented nature, data tracking with sequence numbers, and reliability via receiver ACKs and retransmissions (without premature handshake mentions).
  2. **Header Structure & Field Breakdown**: Present the diagram and table explaining fields (Sequence numbers, Flags, Window size). Ordered delivery is explained inside the table.
  3. **3-Way Handshake**: Explain how the session opens (`SYN` → `SYN-ACK` → `ACK`).
  4. **4-Way Handshake**: Explain how the session terminates (`FIN` → `ACK` → `FIN` → `ACK`).
  5. **Flow Control & Window Size Callout**: A concise callout note at the end of the section explaining sliding window dynamics (sending multiple segments before waiting for ACK, throttling down to 0 on buffer full).
* **Port Security Narrative Flow**:
  1. Intro (protecting switch without naming attacks) → Prerequisite switchport mode (`access` or `trunk`) and enable command.
  2. Maximum MACs (default 1) and configuration command.
  3. Violation modes in bullet points (Shutdown vs. Restrict vs. Protect), highlighting differences in traffic dropping, log generation, and violation counter incrementing (Shutdown increments by 1 on disable; Restrict increments continuously per packet; Protect does not increment).
  4. `err-disabled` state and recovery (manual vs. automatic timer).
  5. MAC Aging progression: explain why aging is needed (default never ages out, blocking new devices), `aging time`, `aging static`, and aging types (`absolute` vs. `inactivity`).
  6. Sticky MAC learning.
  7. Verification show commands.
* **No standalone duplicate comparison tables**: Integrate comparisons smoothly into the narrative and tables without creating separate, redundant comparison tables that just repeat previously stated facts.

---

## 4. Immediate, Per-Topic Command Placement

* **Never aggregate commands at the end of a big chapter**: Do not dump a giant block of mixed CLI commands at the bottom of a major section.
* **Pair each feature with its commands immediately**: Every subtopic, protocol, or feature must be followed **immediately** by its own specific configuration and verification CLI commands with a clear introductory sentence (e.g., `To configure Static NAT:`, `To verify active NAT translations:`).
* **CLI Code Format**:
  ```html
  <p class="body-line">To configure Static NAT (one-to-one mapping):</p>
  <pre class="command-line"><code>interface GigabitEthernet0/0
    ip nat inside                                                   → mark internal private interface
  interface GigabitEthernet0/1
    ip nat outside                                                  → mark external public interface
  ip nat inside source static 192.168.1.50 203.0.113.5             → map private IP permanently to public IP</code></pre>
  ```

---

## 5. Logical Concept Dependencies & Ordering

1. **Port Numbers → TCP/UDP → Well-Known Ports Table**:
   - Teach Port Numbers first (logical sockets, source/dest ports, ranges).
   - Teach 1. TCP and 2. UDP next.
   - Place the **Common Well-Known Ports Table** *after* TCP and UDP, because the table references whether a service uses TCP or UDP.
2. **ACLs → NAT**:
   - Teach ACLs first (packet filtering using L3 IP and L4 Port numbers).
   - Place **NAT** *after* ACLs, because NAT uses ACLs to identify which private IP addresses are permitted to undergo translation.
3. **Syslog → NTP**:
   - Teach **Syslog** first (event logging, severity levels 0–7, message syntax).
   - Place **NTP** *after* Syslog, directly motivated as the necessary tool to synchronize device clocks so log timestamps can be correlated during troubleshooting.
4. **Layer 2 Switch Security**:
   - Belongs inside **Layer 2: Data Link Layer** (Port Security, DHCP Snooping, Dynamic ARP Inspection).
5. **Wireshark Protocol Inspection**:
   - Belongs in **Layer 7: Application Layer** where the full OSI encapsulation stack and decoded application payloads (HTTP, DNS, DHCP) are inspected.

---

## 6. Structural Heading Hierarchy & Acronym Expansion

* **Major Chapters (`<h2 class="major-heading">`)** — strictly reserved for top-level foundational modules:
  1. `Overview` (`#network-intro`)
  2. `Layer 1: Physical Layer` (`#layer-1`)
  3. `Layer 2: Data Link Layer` (`#layer-2`)
  4. `Layer 3: Network Layer` (`#layer-3`)
  5. `Layer 4: Transport Layer` (`#layer-4`)
  6. `Layer 5: Session Layer` (`#layer-5`)
  7. `Layer 6: Presentation Layer` (`#layer-6`)
  8. `Layer 7: Application Layer` (`#layer-7`)
  9. `Enterprise Network Architecture & WAN` (`#network-architecture`)
  10. `Virtualization, SDN & Network Automation` (`#virtualization-sdn-automation`)
* **Subtopics**: Use `<h3 class="subheading">` (and `<h4 class="subheading">` for nested subtopics).
* **Concise Headings & First-Sentence Acronym Expansion**:
  * Keep section titles clean by using the short name / acronym (e.g., `1. TCP`, `2. UDP`, `ACLs`, `NAT`, `QoS & Voice`, `DNS`, `DHCP`, `Syslog`, `NTP`, `SNMP`). Avoid long parentheticals in `<h3 class="subheading">`.
  * Spell out the full name with the acronym in the **first sentence** of the body paragraph immediately following the heading (e.g. `TCP (Transmission Control Protocol) is...`, `UDP (User Datagram Protocol) is...`, `ACLs (Access Control Lists) are...`, `NAT (Network Address Translation) directly builds upon...`).
* **No duplicate IDs**:
  - Summary/preview cards at the top use `id="layer-X-summary"`.
  - Major chapter headings use `id="layer-X"`.
  - All IDs must be clean, lowercase, hyphenated slugs without invalid CSS selector symbols.

---

## 7. Table Formatting Conventions

* In reference tables (e.g. Well-Known Ports):
  * **Protocol column**: Contains the full protocol name with acronym (e.g., `FTP (File Transfer Protocol)`, `SSH (Secure Shell)`).
  * **Description column**: Describes what the protocol does cleanly without redundantly repeating the spelled-out name.

---

## 8. Adding Future Rules

When new rules or refinements are agreed upon, append them directly to this file under their respective section or add a new numbered section below.
