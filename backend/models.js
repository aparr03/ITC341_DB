// Prisoner Entity
class Prisoner {
  constructor({ prisoner_id, cellblock_id, fName, lName, Age, Gender, offense, sentence, admission_date, release_date, behavior_rating, parole_status }) {
    this.prisoner_id = prisoner_id;
    this.cellblock_id = cellblock_id;
    this.fName = fName;
    this.lName = lName;
    this.Age = Age;
    this.Gender = Gender;
    this.offense = offense;
    this.sentence = sentence;
    this.admission_date = admission_date;
    this.release_date = release_date;
    this.behavior_rating = behavior_rating;
    this.parole_status = parole_status;
  }
}

// Parole Entity
class Parole {
  constructor({ parole_id, prisoner_id, status, review_date, notes }) {
    this.parole_id = parole_id;
    this.prisoner_id = prisoner_id;
    this.status = status;
    this.review_date = review_date;
    this.notes = notes;
  }
}

// Cell Entity
class Cell {
  constructor({ cell_id, cell_number, cellblock_id, capacity, occupancy }) {
    this.cell_id = cell_id;
    this.cell_number = cell_number;
    this.cellblock_id = cellblock_id;
    this.capacity = capacity;
    this.occupancy = occupancy;
  }
}

// CellBlock Entity
class CellBlock {
  constructor({ cellblock_id, name, max_capacity, current_capacity }) {
    this.cellblock_id = cellblock_id;
    this.name = name;
    this.max_capacity = max_capacity;
    this.current_capacity = current_capacity;
  }
}

module.exports = { Prisoner, Parole, Cell, CellBlock }; 