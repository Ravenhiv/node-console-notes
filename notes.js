const fs = require('fs')

const command = process.argv[2]
const title = process.argv[3]
const content = process.argv[4]

switch (command) {
  case 'list':
    list((err, notes) => {
      if (err) console.error(err.message)

      notes.forEach((note, index) => console.log(`${index + 1}. ${note.title}`))
    })
    break
  case 'view':
    view(title, (err, note) => {
      if (err) console.error(err.message)
      
      console.log(`# ${note.title}\r\n\r\n---\r\n\r\n${note.content}`)
    })
    break
  case 'create':
    create(title, content, err => {
      if (err) console.error(err.message)

      console.log('Note created.')
    })
    break
  case 'remove':
    remove(title, err => {
      if (err) console.error(err.message)
      
      console.log('Note removed.')      
    })
    break
  default:
    console.log('Undefined command.')
}

function list(done) {
  load(done)
}

function view(title, done) {
  load((err, notes) => {
    if (err) return done(err)

    const note = notes.find(note => note.title === title)

    if (!note) return done(new Error(`There is no note with name "${title}".`))

    done(null, note)
  })
}

function create(title, content, done) {
 load((err, notes) => {
    if (err) return done(err)

    notes.push({ title, content })

    save(notes, done)
  })
}

function remove(title, done) {
  load((err, notes) => {
    if (err) return done(err)

    notes = notes.filter(note => note.title !== title)

    save(notes, done)    
  })
}

function load(done) {
  fs.readFile('notes.json', (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        return done(null, [])
      } else {
        return done(err)
      }
    }

    try {
      const notes = JSON.parse(data)
      done(null, notes)
    } catch (err) {
      // done(new Error('Cannot parse JSON data.'))
      done(err)      
    }
  })
}

function save(notes, done) {
  try {
    const json = JSON.stringify(notes)
    fs.writeFile('notes.json', json, err => {
      if (err) return done(err)

      done()
    })
  } catch (err) {
    done(err)
  }
}