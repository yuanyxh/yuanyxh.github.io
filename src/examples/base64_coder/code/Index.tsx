export default function Default() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#7F848E;font-style:italic">//--meta:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// title: base64 编解码</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// date: 2024-4-21 16:54:00</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// author: yuanyxh</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// description: js 实现的 base64 示例，帮助理解 base64 是如何工作的</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">//--endmeta</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">useState</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'react'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Layout</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'antd'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">import</span><span style="color:#E06C75"> classNames</span><span style="color:#C678DD"> from</span><span style="color:#98C379"> 'classnames'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Outlet</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> '@/router'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Icon</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> '@/components'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">import</span><span style="color:#E06C75"> styles</span><span style="color:#C678DD"> from</span><span style="color:#98C379"> './Index.module.less'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">interface</span><span style="color:#E5C07B"> List</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">  path</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">string</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E06C75">  fullpath</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">string</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#E06C75">  children</span><span style="color:#C678DD">?</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">List</span><span style="color:#ABB2BF">[];</span></span>
<span class="line"><span style="color:#ABB2BF">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">const</span><span style="color:#E5C07B"> data</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">List</span><span style="color:#ABB2BF">[] </span><span style="color:#56B6C2">=</span><span style="color:#ABB2BF"> [</span></span>
<span class="line"><span style="color:#ABB2BF">  {</span></span>
<span class="line"><span style="color:#E06C75">    path</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'utils'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">    fullpath</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'/coder/base64_coder/utils'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">    children</span><span style="color:#ABB2BF">: [</span></span>
<span class="line"><span style="color:#ABB2BF">      {</span></span>
<span class="line"><span style="color:#E06C75">        path</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'base64.ts'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">        fullpath</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'/coder/base64_coder/utils-base64.ts'</span></span>
<span class="line"><span style="color:#ABB2BF">      }</span></span>
<span class="line"><span style="color:#ABB2BF">    ]</span></span>
<span class="line"><span style="color:#ABB2BF">  },</span></span>
<span class="line"><span style="color:#ABB2BF">  {</span></span>
<span class="line"><span style="color:#E06C75">    path</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'Index.module.less'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">    fullpath</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'/coder/base64_coder/Index.module.less'</span></span>
<span class="line"><span style="color:#ABB2BF">  },</span></span>
<span class="line"><span style="color:#ABB2BF">  {</span></span>
<span class="line"><span style="color:#E06C75">    path</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'Index.tsx'</span><span style="color:#ABB2BF">,</span></span>
<span class="line"><span style="color:#E06C75">    fullpath</span><span style="color:#ABB2BF">: </span><span style="color:#98C379">'Index.tsx'</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">];</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">export</span><span style="color:#C678DD"> function</span><span style="color:#61AFEF"> Base64_Coder</span><span style="color:#ABB2BF">() {</span></span>
<span class="line"><span style="color:#C678DD">  return</span><span style="color:#ABB2BF"> &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66;font-style:italic"> className</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E5C07B">styles</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">base64</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF">>&#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">>;</span></span>
<span class="line"><span style="color:#ABB2BF">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">Sider</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#E06C75"> Layout</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">function</span><span style="color:#61AFEF"> Menu</span><span style="color:#ABB2BF">({ </span><span style="color:#E06C75;font-style:italic">items</span><span style="color:#ABB2BF"> }: { </span><span style="color:#E06C75">items</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">List</span><span style="color:#ABB2BF">[] }) {</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#ABB2BF"> [</span><span style="color:#E5C07B">expands</span><span style="color:#ABB2BF">, </span><span style="color:#E5C07B">setExpands</span><span style="color:#ABB2BF">] </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> useState</span><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E5C07B">string</span><span style="color:#ABB2BF">[]>([]);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#61AFEF"> handleSetExpands</span><span style="color:#56B6C2"> =</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75;font-style:italic">key</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">string</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    setExpands</span><span style="color:#ABB2BF">((</span><span style="color:#E06C75;font-style:italic">prev</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">      if</span><span style="color:#ABB2BF"> (</span><span style="color:#E5C07B">prev</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">includes</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">)) {</span></span>
<span class="line"><span style="color:#C678DD">        return</span><span style="color:#E5C07B"> prev</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">filter</span><span style="color:#ABB2BF">((</span><span style="color:#E06C75;font-style:italic">path</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#E06C75"> path</span><span style="color:#56B6C2"> !==</span><span style="color:#E06C75"> key</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#ABB2BF"> [...</span><span style="color:#E06C75">prev</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">key</span><span style="color:#ABB2BF">];</span></span>
<span class="line"><span style="color:#ABB2BF">    });</span></span>
<span class="line"><span style="color:#ABB2BF">  };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  return</span><span style="color:#ABB2BF"> (</span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E06C75">ul</span><span style="color:#D19A66;font-style:italic"> className</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E5C07B">styles</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">list</span><span style="color:#C678DD">}</span><span style="color:#D19A66;font-style:italic"> onClick</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#ABB2BF">(</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#E5C07B"> e</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">stopPropagation</span><span style="color:#ABB2BF">()</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#C678DD">      {</span><span style="color:#E5C07B">items</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">map</span><span style="color:#ABB2BF">((</span><span style="color:#E06C75;font-style:italic">item</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> (</span></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;</span><span style="color:#E06C75">li</span></span>
<span class="line"><span style="color:#D19A66;font-style:italic">          key</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E5C07B">item</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">path</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66;font-style:italic">          className</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#61AFEF">classNames</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">styles</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">item</span><span style="color:#ABB2BF">, {</span></span>
<span class="line"><span style="color:#ABB2BF">            [</span><span style="color:#E5C07B">styles</span><span style="color:#E06C75">.expand</span><span style="color:#ABB2BF">]: </span><span style="color:#E5C07B">expands</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">includes</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">item</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">path</span><span style="color:#ABB2BF">)</span></span>
<span class="line"><span style="color:#ABB2BF">          })</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66;font-style:italic">          onClick</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span></span>
<span class="line"><span style="color:#E5C07B">            item</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">children</span><span style="color:#C678DD"> ?</span><span style="color:#ABB2BF"> () </span><span style="color:#C678DD">=></span><span style="color:#61AFEF"> handleSetExpands</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">item</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">path</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">:</span><span style="color:#D19A66"> undefined</span></span>
<span class="line"><span style="color:#C678DD">          }</span></span>
<span class="line"><span style="color:#ABB2BF">        ></span></span>
<span class="line"><span style="color:#C678DD">          {</span><span style="color:#E5C07B">item</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">children</span><span style="color:#C678DD"> ?</span><span style="color:#ABB2BF"> (</span></span>
<span class="line"><span style="color:#ABB2BF">            &#x3C;</span><span style="color:#E5C07B">Icon</span></span>
<span class="line"><span style="color:#D19A66;font-style:italic">              className</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E5C07B">styles</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">directoryIcon</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66;font-style:italic">              icon</span><span style="color:#56B6C2">=</span><span style="color:#98C379">"material-symbols:keyboard-arrow-right"</span></span>
<span class="line"><span style="color:#ABB2BF">            /></span></span>
<span class="line"><span style="color:#ABB2BF">          ) </span><span style="color:#C678DD">:</span><span style="color:#D19A66"> null</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">          &#x3C;</span><span style="color:#E06C75">span</span><span style="color:#ABB2BF">></span><span style="color:#C678DD">{</span><span style="color:#E5C07B">item</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">path</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF">&#x3C;/</span><span style="color:#E06C75">span</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">          {</span><span style="color:#E5C07B">item</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">children</span><span style="color:#C678DD"> ?</span><span style="color:#ABB2BF"> &#x3C;</span><span style="color:#E5C07B">Menu</span><span style="color:#D19A66;font-style:italic"> items</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E5C07B">item</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">children</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF"> /> </span><span style="color:#C678DD">:</span><span style="color:#D19A66"> null</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;/</span><span style="color:#E06C75">li</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">      ))</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;/</span><span style="color:#E06C75">ul</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  );</span></span>
<span class="line"><span style="color:#ABB2BF">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">export</span><span style="color:#C678DD"> default</span><span style="color:#C678DD"> function</span><span style="color:#61AFEF"> Wrapper</span><span style="color:#ABB2BF">() {</span></span>
<span class="line"><span style="color:#C678DD">  return</span><span style="color:#ABB2BF"> (</span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E5C07B">Layout</span><span style="color:#D19A66;font-style:italic"> className</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E5C07B">styles</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">wrapper</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E5C07B">Sider</span><span style="color:#D19A66;font-style:italic"> className</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E5C07B">styles</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">sider</span><span style="color:#C678DD">}</span><span style="color:#D19A66;font-style:italic"> theme</span><span style="color:#56B6C2">=</span><span style="color:#98C379">"dark"</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;</span><span style="color:#E5C07B">Menu</span><span style="color:#D19A66;font-style:italic"> items</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">data</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;/</span><span style="color:#E5C07B">Sider</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E06C75">main</span><span style="color:#D19A66;font-style:italic"> className</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E5C07B">styles</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">content</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;</span><span style="color:#E06C75">section</span><span style="color:#D19A66;font-style:italic"> className</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E5C07B">styles</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">code</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">          &#x3C;</span><span style="color:#E5C07B">Outlet</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;/</span><span style="color:#E06C75">section</span><span style="color:#ABB2BF">></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">        &#x3C;</span><span style="color:#E06C75">section</span><span style="color:#D19A66;font-style:italic"> className</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E5C07B">styles</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">exhibit</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF">>&#x3C;/</span><span style="color:#E06C75">section</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;/</span><span style="color:#E06C75">main</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;/</span><span style="color:#E5C07B">Layout</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  );</span></span>
<span class="line"><span style="color:#ABB2BF">}</span></span>
<span class="line"></span></code></pre>`
      }}
    ></div>
  );
}
