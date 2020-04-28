const fs = require("fs");
const data = require("../data.json");


exports.show = (req, res) => {
  const { id } = req.params

  const foundRecipe = data.recipes.find((recipe) => {
    return id == recipe.id
  })

  if(!foundRecipe) return res.render("admin/not-found")

  const recipe = {
    ...foundRecipe,
  }

  return res.render("admin/details", { recipe })
}

exports.post = (req, res) => {
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "") {
      return res.send("Por favor preencha todos os campos!");
    }
  }

  let {avatar_url, birth, name, services, gender} = req.body

  birth = Date.parse(birth)
  const created_at = Date.now()
  const id = Number( data.admin.length + 1 )

  data.admin.push({
      id,
      avatar_url,
      name,
      birth,
      gender,
      services,
      created_at,
  });

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) return res.send("Write file error!");

    return res.redirect("/admin");
  });
};

exports.edit = (req, res) => {
  const { id } = req.params

  const foundRecipe = data.admin.find((recipe) => {
    return id == recipe.id
  })

  if(!foundRecipe) return res.render("admin/not-found")

  const recipe ={
    ...foundRecipe,
  }

    
  return res.render('admin/edit', {recipe})
}

exports.put = (req, res) => {
  const { id } = req.body;
  let index = 0;

  const foundRecipe = data.recipes.find((recipe, foundIndex) => {
    if(id == recipe.id){
      index = foundIndex
      return true
    }
  })

  if(!foundRecipe) return res.render("admin/not-found")

  const recipe = {
    ...foundRecipe,
    ...req.body,
    birth: Date.parse(req.body.birth),
    id: Number(req.body.id),
  }

  data.recipes[index] = recipe

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (err) => {
    if(err) return res.send("Write file error!")

    return res.redirect(`admin/${id}`)
  })
}

exports.delete = (req, res) => {
  const { id } = req.body;
  
  const filteredRecipe = data.recipes.filter((recipe) => {
    return recipe.id != id
  });

  data.recipes = filteredRecipe;

  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if(err) {
      return res.send("Write file error!");
    }
    else {
      return res.redirect("/admin");
    }
    
  })
}

exports.index =  (req, res) => {
  return res.render('admin/index', { recipes: data.recipes });
}

exports.create =  (req, res) => {
  return res.render('admin/create');
}


