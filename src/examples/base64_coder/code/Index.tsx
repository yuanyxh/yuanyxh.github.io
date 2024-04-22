export default function Default() {
        return <div dangerouslySetInnerHTML={{ __html: `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#7F848E;font-style:italic">//--meta:</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// title: base64 编解码</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// date: 2024-4-21 16:54:00</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// author: yuanyxh</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">// description: js 实现的 base64 编解码示例，帮助理解 base64 是如何工作的。base64 中的 64 对应 64 个指定的字符，将源字符以 3 字节一组拆分，每组分为 4 个 6 位数字，每位数字对应 64 位字符的索引，以此来编码源字符。</span></span>
<span class="line"><span style="color:#7F848E;font-style:italic">//--endmeta</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">useState</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'react'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Input</span><span style="color:#ABB2BF">, </span><span style="color:#E06C75">message</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> 'antd'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">import</span><span style="color:#ABB2BF"> { </span><span style="color:#E06C75">Icon</span><span style="color:#ABB2BF"> } </span><span style="color:#C678DD">from</span><span style="color:#98C379"> '@/components'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">import</span><span style="color:#E06C75"> styles</span><span style="color:#C678DD"> from</span><span style="color:#98C379"> './styles/Index.module.less'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#C678DD">import</span><span style="color:#E06C75"> base64</span><span style="color:#C678DD"> from</span><span style="color:#98C379"> './utils/base64'</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">type</span><span style="color:#E5C07B"> TChange</span><span style="color:#56B6C2"> =</span><span style="color:#E5C07B"> React</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">ChangeEventHandler</span><span style="color:#ABB2BF">&#x3C;</span><span style="color:#E5C07B">HTMLTextAreaElement</span><span style="color:#ABB2BF">>;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">const</span><span style="color:#ABB2BF"> { </span><span style="color:#E5C07B">TextArea</span><span style="color:#ABB2BF"> } </span><span style="color:#56B6C2">=</span><span style="color:#E06C75"> Input</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">export</span><span style="color:#C678DD"> default</span><span style="color:#C678DD"> function</span><span style="color:#61AFEF"> Base64_Coder</span><span style="color:#ABB2BF">() {</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#ABB2BF"> [</span><span style="color:#E5C07B">messageApi</span><span style="color:#ABB2BF">, </span><span style="color:#E5C07B">contextHolder</span><span style="color:#ABB2BF">] </span><span style="color:#56B6C2">=</span><span style="color:#E5C07B"> message</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">useMessage</span><span style="color:#ABB2BF">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#ABB2BF"> [</span><span style="color:#E5C07B">origin</span><span style="color:#ABB2BF">, </span><span style="color:#E5C07B">setOrigin</span><span style="color:#ABB2BF">] </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> useState</span><span style="color:#ABB2BF">(</span><span style="color:#98C379">''</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#ABB2BF"> [</span><span style="color:#E5C07B">encode</span><span style="color:#ABB2BF">, </span><span style="color:#E5C07B">setEncode</span><span style="color:#ABB2BF">] </span><span style="color:#56B6C2">=</span><span style="color:#61AFEF"> useState</span><span style="color:#ABB2BF">(</span><span style="color:#98C379">''</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#61AFEF"> handleInputOrigin</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">TChange</span><span style="color:#56B6C2"> =</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    setOrigin</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">target</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">value</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#56B6C2">!</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">target</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">value</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#61AFEF"> setEncode</span><span style="color:#ABB2BF">(</span><span style="color:#98C379">''</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    try</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">      setEncode</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">base64</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">encode</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">target</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">value</span><span style="color:#ABB2BF">));</span></span>
<span class="line"><span style="color:#ABB2BF">    } </span><span style="color:#C678DD">catch</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">err</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#E5C07B">      messageApi</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">error</span><span style="color:#ABB2BF">((</span><span style="color:#E06C75">err</span><span style="color:#C678DD"> as</span><span style="color:#E5C07B"> Error</span><span style="color:#ABB2BF">).</span><span style="color:#E06C75">message</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  const</span><span style="color:#61AFEF"> handleInputEncode</span><span style="color:#ABB2BF">: </span><span style="color:#E5C07B">TChange</span><span style="color:#56B6C2"> =</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75;font-style:italic">e</span><span style="color:#ABB2BF">) </span><span style="color:#C678DD">=></span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">    setEncode</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">target</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">value</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    if</span><span style="color:#ABB2BF"> (</span><span style="color:#56B6C2">!</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">target</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">value</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#C678DD">      return</span><span style="color:#61AFEF"> setOrigin</span><span style="color:#ABB2BF">(</span><span style="color:#98C379">''</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">    try</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#61AFEF">      setOrigin</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">base64</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">decode</span><span style="color:#ABB2BF">(</span><span style="color:#E5C07B">e</span><span style="color:#ABB2BF">.</span><span style="color:#E5C07B">target</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">value</span><span style="color:#ABB2BF">));</span></span>
<span class="line"><span style="color:#ABB2BF">    } </span><span style="color:#C678DD">catch</span><span style="color:#ABB2BF"> (</span><span style="color:#E06C75">err</span><span style="color:#ABB2BF">) {</span></span>
<span class="line"><span style="color:#E5C07B">      messageApi</span><span style="color:#ABB2BF">.</span><span style="color:#61AFEF">error</span><span style="color:#ABB2BF">((</span><span style="color:#E06C75">err</span><span style="color:#C678DD"> as</span><span style="color:#E5C07B"> Error</span><span style="color:#ABB2BF">).</span><span style="color:#E06C75">message</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  };</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">  return</span><span style="color:#ABB2BF"> (</span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;</span><span style="color:#E06C75">div</span><span style="color:#D19A66;font-style:italic"> className</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E5C07B">styles</span><span style="color:#ABB2BF">.</span><span style="color:#E06C75">base64_coder</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#C678DD">      {</span><span style="color:#E06C75">contextHolder</span><span style="color:#C678DD">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E5C07B">TextArea</span></span>
<span class="line"><span style="color:#D19A66;font-style:italic">        placeholder</span><span style="color:#56B6C2">=</span><span style="color:#98C379">"输入源字符串"</span></span>
<span class="line"><span style="color:#D19A66;font-style:italic">        rows</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#D19A66">7</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66;font-style:italic">        value</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">origin</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66;font-style:italic">        onChange</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleInputOrigin</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">      /></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E5C07B">Icon</span><span style="color:#D19A66;font-style:italic"> icon</span><span style="color:#56B6C2">=</span><span style="color:#98C379">"material-symbols:sync"</span><span style="color:#D19A66;font-style:italic"> size</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#D19A66">30</span><span style="color:#C678DD">}</span><span style="color:#ABB2BF"> /></span></span>
<span class="line"></span>
<span class="line"><span style="color:#ABB2BF">      &#x3C;</span><span style="color:#E5C07B">TextArea</span></span>
<span class="line"><span style="color:#D19A66;font-style:italic">        placeholder</span><span style="color:#56B6C2">=</span><span style="color:#98C379">"输入 base64 编码字符串"</span></span>
<span class="line"><span style="color:#D19A66;font-style:italic">        rows</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#D19A66">7</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66;font-style:italic">        value</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">encode</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#D19A66;font-style:italic">        onChange</span><span style="color:#56B6C2">=</span><span style="color:#C678DD">{</span><span style="color:#E06C75">handleInputEncode</span><span style="color:#C678DD">}</span></span>
<span class="line"><span style="color:#ABB2BF">      /></span></span>
<span class="line"><span style="color:#ABB2BF">    &#x3C;/</span><span style="color:#E06C75">div</span><span style="color:#ABB2BF">></span></span>
<span class="line"><span style="color:#ABB2BF">  );</span></span>
<span class="line"><span style="color:#ABB2BF">}</span></span>
<span class="line"></span></code></pre>` }}></div>
      }