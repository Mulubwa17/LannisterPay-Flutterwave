const mongoose = require('mongoose');

const { Schema } = mongoose;

const FcsSchema = new Schema(
 {   feeId:  String,
    feeCurrency: String,
    feeLocale: String,
    feeEntity: String,
    feeEntityProperty: String,
    feeType: String,
    feeValue: String,
  }
  );
  
  FcsSchema.index({ locale: 1, entity: 1, entityProperty: 1 });

const Fcs = mongoose.model('fcs', FcsSchema);

module.exports = Fcs;