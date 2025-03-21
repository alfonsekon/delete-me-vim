const maze2 = `
┌─┬───────────┬───┬───────────┬─────────┬───────┬───────────────┬─┬───────┐ 
│ └─┬─╴ ┌───┐ ╵ ╷ │ ╶───┬───┐ ╵ ╶───┐ ┌─┘ ╷ ┌─╴ └─╴ ╷ ┌───┬───┐ │ ╵ ╶─┐ ╶─┤ 
├─┐ │ ┌─┘ ╶─┴───┤ └───┐ └─╴ ├───────┘ │ ╶─┤ └───────┴─┘ ╷ │ ╷ │ ├───┐ ├─╴ │ 
│ │ │ └─┐ ╷ ╶───┴─┬─╴ ├───╴ │ ┌─╴ ┌───┴─╴ ├───┬───────┐ │ │ └─┤ ╵ ╷ ├─┘ ╷ │ 
│ │ └─┐ │ ├───┐ ╷ ╵ ┌─┘ ┌───┤ └─┐ │ ╶─────┤ ╷ │ ╶───┐ ├─┘ │ ╷ └───┤ │ ╶─┴─┤ 
│ └─┐ │ └─┘ ╷ │ └───┤ ╶─┤ ╷ └─┐ └─┴───┬─╴ │ ├─┴───╴ │ ╵ ┌─┴─┴─┐ ┌─┘ │ ╶─┐ │ 
│ ╷ │ ├─────┤ └─┬───┴─╴ │ │ ╷ └───┐ ┌─┘ ╶─┘ │ ┌─────┴───┤ ┌─╴ │ │ ┌─┴─┐ │ │ 
│ └─┘ │ ╶─┐ └─╴ │ ┌─────┴─┘ ├───╴ │ ╵ ┌───┬─┘ ├─────╴ ╷ ╵ │ ╶─┘ │ │ ╶─┘ │ │ 
│ ┌───┴─┐ └─────┘ │ ┌───┬───┴─────┤ ┌─┘ ╷ ╵ ┌─┘ ┌─────┴─┬─┴───╴ │ │ ┌───┘ │ 
│ ├─╴ ╷ └───┐ ╶───┤ │ ╷ │ ╶───┬─┐ └─┘ ┌─┼───┘ ╷ │ ╶─┬─┐ └─────┐ │ └─┘ ┌─┐ │ 
│ │ ╶─┴─┬─╴ ├───┐ ╵ │ │ └───╴ │ └─┬───┤ ╵ ╷ ╶─┤ └─┐ ╵ ├─────┐ └─┴─────┘ │ │ 
│ │ ╶─┐ └─┐ ╵ ╷ └───┤ └─────┬─┘ ╷ ╵ ╷ ╵ ┌─┴─┐ │ ┌─┴─╴ │ ┌─╴ └───────┐ ╷ │ │ 
│ └─┐ ├─╴ ├─╴ ├───┐ └─┐ ╶─┐ │ ╶─┼───┴───┤ ╷ │ │ │ ┌───┘ │ ╶─┬─────┐ │ │ │ │ 
├─┐ ├─┘ ┌─┘ ┌─┘ ╷ └─┐ └───┤ ├─┐ │ ╶─┬─╴ ╵ │ ╵ │ │ └─────┤ ╷ │ ╶─┬─┘ │ └─┘ │ 
│ │ │ ╶─┴───┤ ┌─┴─╴ ├───╴ │ │ ╵ └─┐ └─┬───┼─┬─┘ ├─────┐ └─┤ │ ╷ ╵ ┌─┴─────┤ 
│ │ │ ╶─┬─┐ ╵ │ ╶─┬─┤ ╶───┤ └─┬─┐ ├─┐ │ ╷ │ ╵ ┌─┘ ╷ ┌─┴─╴ │ └─┴─┐ └─╴ ┌─┐ │ 
│ │ └─┐ │ └───┼─╴ │ └───┐ └─╴ │ │ ╵ │ ╵ │ │ ┌─┴─┐ │ │ ┌───┘ ╶─┐ └───┬─┘ ╵ │ 
│ └─┐ │ └─╴ ╷ │ ┌─┴─┬─╴ └─────┘ └─┐ └───┤ │ ╵ ╷ └─┘ │ └─┬─────┴───╴ │ ┌───┤ 
│ ╷ ╵ ├─────┤ │ │ ╷ ╵ ┌───┐ ┌─────┴───┐ │ ├───┴───╴ └─┐ ╵ ┌───┬─────┤ └─┐ │ 
│ ├───┘ ┌─┐ └─┘ │ └─┐ │ ╷ ├─┘ ┌─────┐ ╵ │ └───────────┼───┘ ╷ ╵ ╷ ┌─┴─┐ │ │ 
│ │ ┌───┘ ├─────┘ ╷ ├─┘ │ ╵ ┌─┴─╴ ╷ └───┼─────┬───┬─┐ │ ┌───┴─┬─┤ │ ╷ │ │ │ 
│ ╵ │ ╷ ╶─┘ ╶─────┤ ╵ ╶─┴───┘ ┌───┴───╴ └─╴ ╷ ╵ ╷ ╵ │ ╵ ╵ ┌─╴ ╵ │ ╵ │ ╵ ╵ │ 
└───┴─┴───────────┴───────────┴─────────────┴───┴───┴─────┴─────┴───┴─────┘ 
`;

const maze = `x  <-  Delete to Start
   █████████████████████████████████████████████████████████████████████████
   █  █                       █     █  █        █  █                 █     █
█  █  ████  █  █  █  ██████████  ████  ████  ████  █  █████████████  █  █  █
█     █     █  █  █  █  █           █              █           █     █  █  █
████  █  █████████████  ███████  █  █  █  ████  ████  ███████  █  ████  ████
█  █                 █  █        █  █  █     █        █        █  █        █
█  █  ██████████  █  █  ██████████  ████  ████  █  █  ███████  ████  ███████
█     █     █     █  █                    █     █  █  █     █        █     █
█  ████  ██████████  █████████████  ████  █  █  █  █  █  ███████  ███████  █
█           █        █  █     █     █     █  █  █  █  █  █  █        █     █
█  ████  ████  █  █  █  █  ██████████████████████  █  █  █  █████████████  █
█  █  █     █  █  █              █  █  █        █  █                       █
████  █████████████  █  ███████  █  █  ███████  ███████  ███████  █  ███████
█        █     █  █  █  █           █  █                 █     █  █  █     █
█  █  █  ████  █  █  ███████  ███████  █  ████  ███████  ████  █  █  ████  █
█  █  █  █     █  █     █                 █     █           █     █        █
███████  ████  █  █  ██████████  ███████  ████████████████  ████  ███████  █
█     █     █     █     █        █  █              █     █  █     █        █
█  █  █  █  ████  █  ██████████  █  ███████████████████  █  █  ██████████  █
█  █     █           █                                █     █     █        █
████████████████████████████████████████████████████████████████████████████  
`;

module.exports = { maze, maze2 };