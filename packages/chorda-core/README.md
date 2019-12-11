#### Install

```bash
npm install @chorda/core @chorda/react
```

#### Renderer
```bash
import { Config } from '@chorda/core'
import { ReactRenderer } from '@chorda/react'

Config.use(ReactRenderer);
```

#### Component
```bash
const app = new Html({
    css: 'application'
});
```

#### DOM
```bash
document.addEventListener('DOMContentLoaded', function () {
    Config.Renderer.append(app, document.getElementById('app'))
});
```