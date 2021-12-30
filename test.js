let a=['a','b','c','d','e','f']
console.log(a);
a.map((d,index)=>{
  if(d=='c'){
    a.splice(index,index-1)
  }
})
console.log(a);