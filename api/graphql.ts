import { schema } from "nexus";
      
schema.addToContext(req => {
  return {
    memoryDB: {
      worlds: [
        { id: "1", population: 6_000_000, name: "Earth" },
        { id: "2", population: 0, name: "Mars" }
      ]
    }
  }
})
      
schema.objectType({
  name: "World",
  definition(t) {
    t.id("id")
    t.string("name")
    t.float("population")
  }
})
      
schema.queryType({
  definition(t) {        
    t.field("hello", {
      type: "World",
      args: {
        world: schema.stringArg({ required: false })
      },
      resolve(_root, args, ctx) {
        const worldToFindByName = args.world ?? "Earth"
        const world = ctx.memoryDB.worlds.find(w => w.name === worldToFindByName)
      
        if (!world) throw new Error(`No such world named "${args.world}"`)
      
        return world
      }
    })
      
    t.list.field('worlds', {
      type: 'World',
      resolve(_root, _args, ctx) {
        return ctx.memoryDB.worlds
      } 
    })
  }
})