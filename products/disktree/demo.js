/* A deliberately fictional illustration. This page never reads the visitor's disk. */
(() => {
  const NS = 'http://www.w3.org/2000/svg';
  const palettes = {
    default: ['#b4e6aa','#61c899','#2caa93','#8ccea0','#d7bb65','#45ad99','#c3dda1'],
    spring: ['#b8df89','#efb8cc','#7fbc84','#f0c9d5','#c8dca3','#dba9c4','#a9d095'],
    summer: ['#72d1a0','#6ebcb0','#b3a0db','#4aac82','#a4d9a5','#7eabe0','#968bce'],
    fall: ['#efc063','#d98051','#c35d51','#dca850','#d98867','#cdad58','#a97c69'],
    winter: ['#a0d8e4','#90b7d9','#9bd1b9','#b9c6e5','#b5d7da','#83b9c0','#c0d8ed']
  };
  const looks = {
    original: { season: 'default', leaf: 'square', trunk: 'gold', scene: 'grove', title: 'Original' },
    spring: { season: 'spring', leaf: 'magnolia', trunk: 'birch', scene: 'sakura', title: 'Spring magnolia' },
    winter: { season: 'winter', leaf: 'ginkgo', trunk: 'crystal', scene: 'aurora', title: 'Winter ginkgo' }
  };
  const folder = (name, size, children) => ({name, size, children});
  const file = (name, size) => ({name, size});
  const root = folder('This Mac',256,[
    folder('Models',96,[file('Language model',48),file('Vision model',32),file('Embeddings',16)]),
    folder('Development',64,[folder('Projects',40,[file('Demo project',24),file('Assets',16)]),folder('Builds',16,[file('App build',12),file('Build cache',4)]),file('Toolchains',8)]),
    folder('Library',40,[file('App support',24),file('Caches',12),file('Logs',4)]),
    folder('Downloads',24,[file('Archive.zip',16),file('Installer.dmg',8)]),
    folder('Media',20,[file('Video edit',12),file('Photos',8)]),
    folder('Documents',8,[file('Design files',6),file('Notes',2)]),
    folder('.cache',4,[file('Package cache',3),file('Temp data',1)])
  ]);
  const biggest = {name:'Biggest files',size:156,children:[file('Language model',48),file('Vision model',32),file('Demo project',24),file('Embeddings',16),file('Archive.zip',16),file('Video edit',12),file('Installer.dmg',8)]};
  const rootFrames = [[226,143,190,164],[76,167,142,146],[425,181,118,114],[264,62,108,72],[279,316,84,78],[174,112,56,46],[426,311,42,39]];
  const smallFrames = [[182,122,244,205],[338,336,136,113],[111,335,117,97]];
  const svg = document.getElementById('demo-tree');
  let appearance = {...looks.original}, mode = 'tree', current = root;
  const node = (tag, attrs = {}) => {
    const el = document.createElementNS(NS,tag);
    Object.entries(attrs).forEach(([key,value]) => el.setAttribute(key,value)); return el;
  };
  // The leaf silhouettes follow DiskTree's normalized Magnolia/Ginkgo paths.
  const shapes = {
    magnolia: 'M0 .64C.015 .19 .20 .01 .45 .015C.72 .015 .90 .21 1 .24C.99 .65 .84 .97 .56 .99C.24 1.02 .06 .85 0 .64Z',
    ginkgo: 'M.5 1C.39 .78 .08 .60 0 .26C.04 .07 .25 -.02 .43 .01C.49 .015 .47 .09 .5 .11C.53 .09 .51 .015 .57 .01C.75 -.02 .96 .07 1 .26C.92 .60 .61 .78 .5 1Z'
  };
  function draw(target, branch, style, interactive = false) {
    target.replaceChildren();
    const id = target.id || target.dataset.preview;
    const defs = node('defs');
    palettes[style.season].forEach((colour,index) => {
      const gradient = node('linearGradient',{id:`${id}-colour-${index}`,x1:'0%',y1:'0%',x2:'90%',y2:'100%'});
      gradient.append(node('stop',{offset:'0%','stop-color':colour}),node('stop',{offset:'100%','stop-color':colour,'stop-opacity':'.80'}));
      defs.append(gradient);
    });
    const shadow = node('filter',{id:`${id}-shadow`,x:'-25%',y:'-25%',width:'150%',height:'160%'});
    shadow.append(node('feDropShadow',{dx:0,dy:4,stdDeviation:4,'flood-color':'#123c32','flood-opacity':'.18'})); defs.append(shadow);
    target.append(defs);
    const trunk = node('image',{href:`assets/trunk-${style.trunk}.png`,x:66,y:10,width:520,height:550,'aria-hidden':'true'});target.append(trunk);
    const items = branch.children || [], frames = items.length > 3 ? rootFrames : smallFrames;
    items.forEach((item,index) => {
      let [x,y,w,h] = frames[index];
      if (items.length === 2) { [x,y,w,h] = index ? [355,202,146,146] : [142,148,204,204]; }
      const group = node('g',{'transform':`translate(${x} ${y})`});
      const hit = node('g',{'class':interactive ? 'tree-tile' : '',filter:`url(#${id}-shadow)`});
      if (interactive) {
        hit.setAttribute('role','button');hit.setAttribute('tabindex','0');
        hit.setAttribute('aria-label',`${item.name}, ${item.size} GB, ${item.children ? 'open folder' : 'show file details'}`);
        const title=node('title');title.textContent=`${item.name} · ${item.size} GB`;hit.append(title);
        const activate = () => {
          if (item.children && mode === 'tree') { current=item;render();svg.querySelector('[role=button]')?.focus({preventScroll:true}); }
          else document.getElementById('demo-hint').textContent=`${item.name} · ${item.size} GB · Sample file. In DiskTree, open its folder or reveal it in Finder.`;
        };
        hit.addEventListener('click',activate);
        hit.addEventListener('keydown',(event)=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();activate();}});
      }
      const fill=`url(#${id}-colour-${index % 7})`;
      if (style.leaf==='square') {
        hit.append(node('rect',{width:w,height:h,rx:Math.min(14,w*.12),fill,stroke:'#285c48','stroke-opacity':'.7','stroke-width':2}));
        hit.append(node('rect',{x:4,y:4,width:w-8,height:h-8,rx:Math.min(11,w*.1),fill:'none',stroke:'#f5ffdb','stroke-opacity':'.45'}));
      } else {
        const mirrorX = x+w/2<320, mirrorY = y+h/2>245;
        hit.append(node('path',{d:shapes[style.leaf],transform:`translate(${mirrorX?w:0} ${mirrorY?h:0}) scale(${mirrorX?-w:w} ${mirrorY?-h:h})`,fill,stroke:'#326b58','stroke-opacity':'.55','stroke-width':1.5,'vector-effect':'non-scaling-stroke'}));
      }
      if (interactive && w>=80) {
        const middle = style.leaf==='ginkgo' ? (y+h/2>245 ? .66 : .36) : .5;
        const labelWidth = w * (style.leaf === 'square' ? .88 : .60);
        const font = Math.min(17, labelWidth/(item.name.length*.60));
        const label = node('text',{x:w/2,y:h*middle-4,'text-anchor':'middle','font-weight':650,'font-size':Math.max(8,font)});label.textContent=item.name;
        const size = node('text',{x:w/2,y:h*middle+16,'text-anchor':'middle','font-size':Math.max(10,font*.78),'fill-opacity':'.8'});size.textContent=`${item.size} GB`;
        hit.append(label,size);
      }
      group.append(hit);target.append(group);
    });
  }
  function render() {
    const branch = mode==='tree' ? current : biggest;
    draw(svg,branch,appearance,true);
    document.getElementById('branch-name').textContent=branch.name;
    document.getElementById('branch-size').textContent=`${branch.size} GB in this sample`;
    document.getElementById('demo-hint').textContent=mode==='tree' ? 'Select a folder to explore its branches.' : 'Largest individual files across the sample. Select one for details.';
    document.querySelector('.tree-window').dataset.scene=appearance.scene;
    document.querySelectorAll('[data-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mode===mode)));
    document.querySelectorAll('[data-season]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.season===appearance.season)));
  }
  document.querySelectorAll('[data-preview]').forEach(preview=>draw(preview,root,looks[preview.dataset.preview]));
  document.querySelectorAll('[data-look]').forEach(button=>button.addEventListener('click',()=>{
    appearance={...looks[button.dataset.look]};
    document.querySelectorAll('[data-preview]').forEach(preview=>draw(preview,root,looks[preview.dataset.preview]));
    document.querySelectorAll('[data-look]').forEach(other=>{const selected=other===button;other.classList.toggle('is-selected',selected);other.setAttribute('aria-pressed',String(selected));});
    document.getElementById('appearance-status').textContent=`${appearance.title} applied to the interactive tree above. Your current branch stays open.`;
    render();
  }));
  document.querySelectorAll('[data-season]').forEach(button=>button.addEventListener('click',()=>{
    appearance.season=button.dataset.season;
    document.querySelectorAll('[data-look]').forEach(other=>{other.classList.remove('is-selected');other.setAttribute('aria-pressed','false');});
    // Also recolour the selected-style preview so the effect is visible beside these controls.
    const lookKey = Object.keys(looks).find(key=>looks[key].leaf===appearance.leaf) || 'original';
    draw(document.querySelector(`[data-preview="${lookKey}"]`),root,appearance);
    document.getElementById('appearance-status').textContent=`${button.textContent.trim()} colours applied to the tree and ${looks[lookKey].title.toLowerCase()} preview. Leaves, trunk and background are unchanged.`;
    render();
  }));
  document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{mode=button.dataset.mode;render();}));
  document.getElementById('reset-tree').addEventListener('click',()=>{current=root;mode='tree';render();});
  document.getElementById('show-biggest').addEventListener('click',()=>{mode='biggest';render();document.getElementById('explore').scrollIntoView({block:'center'});document.querySelector('[data-mode="biggest"]').focus({preventScroll:true});});
  document.getElementById('copy-commands').addEventListener('click',async(event)=>{
    const button = event.currentTarget;
    try {
      await navigator.clipboard.writeText(document.getElementById('commands').textContent);
      button.textContent='Copied';document.getElementById('copy-status').textContent='Commands copied.';
    } catch {
      const selection=window.getSelection(),range=document.createRange();range.selectNodeContents(document.getElementById('commands'));selection.removeAllRanges();selection.addRange(range);
      document.getElementById('copy-status').textContent='Commands selected. Use your browser’s Copy command.';
    }
  });
  render();
})();
