(function(){
  // 开区筛选
  var btns = document.querySelectorAll('.fbtn');
  var countEl = document.querySelector('.fcount');
  function apply(f){
    var rows = document.querySelectorAll('[data-ver]');
    var n = 0;
    rows.forEach(function(r){
      var ok = (f === 'all' || r.getAttribute('data-ver') === f);
      r.classList.toggle('hide', !ok);
      if(ok) n++;
    });
    if(countEl) countEl.textContent = '共 ' + n + ' 组';
  }
  btns.forEach(function(b){
    b.addEventListener('click', function(){
      btns.forEach(function(x){ x.classList.remove('on'); });
      b.classList.add('on');
      apply(b.getAttribute('data-filter'));
    });
  });
  if(btns.length){ apply('all'); }

  // 站内搜索
  var qEl = document.getElementById('q');
  var res = document.getElementById('result');
  function run(q){
    if(!res) return;
    q = (q || '').trim();
    if(!q){
      res.innerHTML = '<p class="r-tip">输入关键词后，结果显示在这里。也可以直接浏览 <a href="sitemap.html">全部文章索引</a>。</p>';
      return;
    }
    var idx = window.SITE_INDEX || [];
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    var hits = idx.map(function(it){
      var hay = (it.t + ' ' + it.k + ' ' + it.d + ' ' + it.x + ' ' + it.c).toLowerCase();
      var score = 0;
      terms.forEach(function(t){
        if(it.t.toLowerCase().indexOf(t) > -1) score += 12;
        if(it.k.toLowerCase().indexOf(t) > -1) score += 6;
        if(it.d.toLowerCase().indexOf(t) > -1) score += 4;
        if(hay.indexOf(t) > -1) score += 1;
      });
      return {it: it, s: score};
    }).filter(function(x){ return x.s > 0; }).sort(function(a,b){ return b.s - a.s; }).slice(0, 20);
    if(!hits.length){
      res.innerHTML = '<p class="r-tip">没有找到与“' + q.replace(/</g,'&lt;') + '”相关的内容。<br>可以换成更短的词，或去 <a href="sitemap.html">全部文章索引</a> 里翻。</p>';
      return;
    }
    var html = '<p class="r-head">找到 ' + hits.length + ' 条结果</p>';
    hits.forEach(function(h){
      html += '<a class="r-item" href="' + h.it.u + '"><b>' + h.it.t + '</b><em>' + h.it.d + '</em><span>' + h.it.c + ' · ' + h.it.o + '</span></a>';
    });
    res.innerHTML = html;
  }
  if(qEl){
    var m = location.search.match(/[?&]q=([^&]*)/);
    if(m){ qEl.value = decodeURIComponent(m[1].replace(/\+/g, ' ')); }
    run(qEl.value);
    qEl.addEventListener('input', function(){ run(qEl.value); });
  }
  var form = document.querySelector('.bigsearch');
  if(form){ form.addEventListener('submit', function(e){ e.preventDefault(); run(qEl.value); }); }
})();
