export default function Default() {
        return <div dangerouslySetInnerHTML={{ __html: `<pre class="shiki one-dark-pro" style="background-color:#282c34;color:#abb2bf" tabindex="0"><code><span class="line"><span style="color:#D19A66">.wrapper</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">  width: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">%</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  height: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">vh</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">  overflow: auto;</span></span>
<span class="line"><span style="color:#ABB2BF">  background-color: </span><span style="color:#D19A66">#1f1f1f</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .sider</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    overflow: auto;</span></span>
<span class="line"><span style="color:#ABB2BF">    background-color: </span><span style="color:#D19A66">#181818</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    box-shadow: </span><span style="color:#D19A66">1</span><span style="color:#E06C75">px</span><span style="color:#D19A66"> 0</span><span style="color:#D19A66"> 1</span><span style="color:#E06C75">px</span><span style="color:#56B6C2"> rgb</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">255</span><span style="color:#D19A66"> 255</span><span style="color:#D19A66"> 255</span><span style="color:#ABB2BF"> / </span><span style="color:#D19A66">5</span><span style="color:#E06C75">%</span><span style="color:#ABB2BF">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">    .list</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">      padding: </span><span style="color:#D19A66">10</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">      .item</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">        line-height: </span><span style="color:#D19A66">1.6</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">        color: </span><span style="color:#D19A66">#ccc</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">        cursor: pointer;</span></span>
<span class="line"><span style="color:#ABB2BF">        user-select: none;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">        .row</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">          border-radius: </span><span style="color:#D19A66">2</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">          transition: background-color </span><span style="color:#D19A66">0.2</span><span style="color:#E06C75">s</span><span style="color:#ABB2BF"> ease;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">          &#x26;.active</span><span style="color:#C678DD">,</span></span>
<span class="line"><span style="color:#D19A66">          &#x26;</span><span style="color:#56B6C2">:not(</span><span style="color:#D19A66">.directory</span><span style="color:#56B6C2">)</span><span style="color:#C678DD">:</span><span style="color:#56B6C2">hover</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">            background-color: </span><span style="color:#D19A66">#37373d</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">          > </span><span style="color:#D19A66">.directoryIcon</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">            svg</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">              transition: transform </span><span style="color:#D19A66">0.2</span><span style="color:#E06C75">s</span><span style="color:#ABB2BF"> ease;</span></span>
<span class="line"><span style="color:#ABB2BF">            }</span></span>
<span class="line"><span style="color:#ABB2BF">          }</span></span>
<span class="line"><span style="color:#ABB2BF">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">        > </span><span style="color:#D19A66">.list</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">          height: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">          padding: </span><span style="color:#D19A66">0</span><span style="color:#D19A66"> 10</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">          overflow: hidden;</span></span>
<span class="line"><span style="color:#ABB2BF">          transition: height </span><span style="color:#D19A66">0.2</span><span style="color:#E06C75">s</span><span style="color:#ABB2BF"> ease;</span></span>
<span class="line"><span style="color:#ABB2BF">          will-change: height;</span></span>
<span class="line"><span style="color:#ABB2BF">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">        &#x26;.expand</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">          > </span><span style="color:#D19A66">.list</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">            height: fit</span><span style="color:#56B6C2">-</span><span style="color:#ABB2BF">content;</span></span>
<span class="line"><span style="color:#ABB2BF">          }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">          .row</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#C678DD">            > </span><span style="color:#D19A66">.directoryIcon</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#E06C75">              svg</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">                transform: </span><span style="color:#56B6C2">rotate</span><span style="color:#ABB2BF">(</span><span style="color:#D19A66">90</span><span style="color:#E06C75">deg</span><span style="color:#ABB2BF">);</span></span>
<span class="line"><span style="color:#ABB2BF">              }</span></span>
<span class="line"><span style="color:#ABB2BF">            }</span></span>
<span class="line"><span style="color:#ABB2BF">          }</span></span>
<span class="line"><span style="color:#ABB2BF">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">        span</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">          margin-left: </span><span style="color:#D19A66">8</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">        .directoryIcon</span><span style="color:#C678DD"> + </span><span style="color:#E06C75">span</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">          margin-left: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">        }</span></span>
<span class="line"><span style="color:#ABB2BF">      }</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">  .content</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">    display: flex;</span></span>
<span class="line"><span style="color:#ABB2BF">    width: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">%</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    height: </span><span style="color:#D19A66">100</span><span style="color:#E06C75">%</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">    .code</span><span style="color:#C678DD">,</span></span>
<span class="line"><span style="color:#D19A66">    .exhibit</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">      flex: </span><span style="color:#D19A66">1</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">    .code</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">      padding: </span><span style="color:#D19A66">10</span><span style="color:#E06C75">px</span><span style="color:#D19A66"> 5</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      padding-bottom: </span><span style="color:#D19A66">250</span><span style="color:#E06C75">px</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      overflow: auto;</span></span>
<span class="line"><span style="color:#E06C75">      scrollbar-color</span><span style="color:#C678DD">: transparent transparent</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      background-color: </span><span style="color:#D19A66">#282c34</span><span style="color:#ABB2BF">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">      &#x26;</span><span style="color:#56B6C2">::-webkit-scrollbar</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">        width: </span><span style="color:#D19A66">0</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D19A66">      &#x26;</span><span style="color:#56B6C2">::-webkit-scrollbar-thumb</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">        background-color: transparent;</span></span>
<span class="line"><span style="color:#ABB2BF">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">      code</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">        font-family: </span><span style="color:#56B6C2">var</span><span style="color:#ABB2BF">(--font-family-code);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E06C75">        span</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">          font-style: normal </span><span style="color:#C678DD">!important</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">        }</span></span>
<span class="line"><span style="color:#ABB2BF">      }</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">@media</span><span style="color:#ABB2BF"> screen and (width > 1366px) {</span></span>
<span class="line"><span style="color:#D19A66">  .wrapper</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#D19A66">    .sider</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">      width: </span><span style="color:#D19A66">250</span><span style="color:#E06C75">px</span><span style="color:#C678DD"> !important</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      min-width: </span><span style="color:#D19A66">250</span><span style="color:#E06C75">px</span><span style="color:#C678DD"> !important</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">      max-width: </span><span style="color:#D19A66">250</span><span style="color:#E06C75">px</span><span style="color:#C678DD"> !important</span><span style="color:#ABB2BF">;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#C678DD">@media</span><span style="color:#ABB2BF"> screen and (width &#x3C;= 768px) {</span></span>
<span class="line"><span style="color:#D19A66">  .wrapper</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#D19A66">    .content</span><span style="color:#ABB2BF"> {</span></span>
<span class="line"><span style="color:#ABB2BF">      flex-direction: column;</span></span>
<span class="line"><span style="color:#ABB2BF">    }</span></span>
<span class="line"><span style="color:#ABB2BF">  }</span></span>
<span class="line"><span style="color:#ABB2BF">}</span></span>
<span class="line"></span></code></pre>` }}></div>
      }