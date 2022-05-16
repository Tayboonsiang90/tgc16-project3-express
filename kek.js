let kek = "t=1652692123,v1=c0016dd3597bcc43e66dfd85722108c1721359ad4646bc14038c623e878d9036,v0=e98b11e249f4d0a7c1a3772a0133545dd0308754a1e7c543e0dfbd8c5cefe0c0";
kek = kek.replace(",", '","');
kek = kek.replace("t=", '"t":"')
kek = kek.replace("v1=", 'v1":"');
kek = kek.replace(",v0=", '","v0":"');
console.log(JSON.parse("{" + kek + '"}'));
