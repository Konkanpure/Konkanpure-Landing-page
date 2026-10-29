(() => {
 const form=document.querySelector('#lead-form');if(!form)return;
 const field=id=>document.getElementById(id),products=window.KONKAN_PRODUCTS;
 products.filter(p=>!p.soon).forEach(p=>field('product-interest').add(new Option(p.name,p.id)));
 const params=new URLSearchParams(location.search);const selected=products.find(p=>p.id===params.get('product')&&!p.soon);if(selected)field('product-interest').value=selected.id;
 if(['home','business'].includes(params.get('buyer')))field('buyer').value=params.get('buyer');
 document.querySelectorAll('[data-buyer]').forEach(a=>a.addEventListener('click',()=>field('buyer').value=a.dataset.buyer));
 form.addEventListener('submit',e=>{e.preventDefault();const name=field('name').value.trim();if(!name){field('name').setCustomValidity('Please enter your name.');field('name').reportValidity();return;}
 const p=products.find(p=>p.id===field('product-interest').value);const body=`Namaskar KONKANPURE!\nSeason 2027 enquiry\n\nName: ${name}\nBuyer: ${field('buyer').value==='business'?'Business / B2B':'Home / B2C'}\nProduct: ${p?.name||'Help me choose'}\nQuantity: ${field('quantity').value.trim()||'To discuss'}\nTiming: ${field('timing').value}\nDelivery location: ${field('delivery-location').value.trim()||'To discuss'}\n\n${field('requirements').value.trim()}`;
 if(e.submitter?.value==='email')location.href=`mailto:konkanpure@gmail.com?subject=${encodeURIComponent('KONKANPURE — Season 2027 enquiry')}&body=${encodeURIComponent(body)}`;else{const a=document.createElement('a');a.href=`https://wa.me/919422529374?text=${encodeURIComponent(body)}`;a.target='_blank';a.rel='noopener noreferrer';a.click();}field('form-status').textContent='Review your enquiry in your messaging app, then send it when ready.';});field('name').addEventListener('input',()=>field('name').setCustomValidity(''));
})();
