const Fcs = require("../models/Fcs");
const Transaction = require("../models/Transaction");

exports.fees = async (req, res) => {
  try {
    const payload = req.body;
    fcsconfig = payload.FeeConfigurationSpec?.split('\n');

    for (let i = 0; i < fcsconfig?.length; i++) {
        temp = fcsconfig[i].split(" ");

        new_data = {
            feeId: temp[0],
            feeCurrency: temp[1],
            feeLocale: temp[2],
            feeEntity: temp[3].split("(")[0],
            feeEntityProperty: temp[3].split("(")[1].split(")")[0],
            feeType: temp[6],
            feeValue: temp[7]
        };

        let recordExists = await Fcs.findOne({ feeId: new_data.feeId });
        if (recordExists) {
            return res.status(400).json(`${new_data.feeId} already exists`);
        }
        let fcs = await new Fcs(new_data);
        await fcs.save(async(err, responseObj) => {
            if (err) {
                console.log("error whilst saving to db", err);
            } else {
                console.log("success");
                responseObj.save();
            }
        });;
    };
    return res.status(200).send({ status: "ok" });
  } catch (err) {
    res.status(500).json({
      status: "Duplicate Entry, Remove saved configuration GET /removefees",
    });
  }
};

exports.transaction = async (req, res) => {
  try {
    
      const payload = {ID : req.body.ID , Amount : req.body.Amount , Currency : req.body.Currency , CurrencyCountry : req.body.CurrencyCountry , Customer : req.body.Customer , PaymentEntity : req.body.PaymentEntity};
      if (payload.Currency !== 'NGN') return res.status(200).json({ Error: `No fee configuration for ${payload.Currency} transactions.` });
      const fee_locale = (payload.CurrencyCountry === payload.PaymentEntity.Country) ?
          'LOCL' : 'INTL';
      const entity_props = payload.PaymentEntity.Brand;
      const fee_entity = payload.PaymentEntity.Type;

      results = await Fcs.find({
          fee_locale: { '$in': [fee_locale, '*'] },
          fee_entity: { '$in': [fee_entity, '*'] },
          entity_property: { '$in': [entity_props, '*'] }
      });
      const FCS = results[results.length - 1];

      const amount = payload.Amount;
      if (payload.Customer.BearsFee) {
          fee_charged = await handleFee(Amount, FCS.feeType, FCS.feeValue);
          fee_charged = Math.round(fee_charged);
          let chargeAmount = amount + fee_charged;
          let settlementAmount = chargeAmount - fee_charged;

          return res.status(200).json({
              AppliedFeeID: FCS.feeId,
              AppliedFeeValue: fee_charged,
              ChargeAmount: chargeAmount,
              SettlementAmount: settlementAmount
          })
      } else {
          fee_charged = await handleFee(Amount, FCS.feeType, FCS.feeValue);
          fee_charged = Math.round(fee_charged);
          let chargeAmount = amount;
          let settlementAmount = chargeAmount - fee_charged;

          return res.status(200).json({
              AppliedFeeID: FCS.feeId,
              AppliedFeeValue: fee_charged,
              ChargeAmount: chargeAmount,
              SettlementAmount: settlementAmount
          });
      };
  
  } catch (err) {
    res.status(500).json({
      status: "Duplicate Entry",
    });
  }
};

const handleFee = async (Amount, feeType, feeValue) => {
  if (feeType === "FLAT") {
    return amount + feeValue;
  } else if (feeType === "PERC") {
    let applied_fee_val = (parseFloat(feeValue) / 100) * amount;
    return applied_fee_val;
  } else if (feeType === "FLAT_PERC") {
    let flat = parseInt(feeValue.split(":")[0]);
    let perc = parseFloat(feeValue.split(":")[1]);
    let applied_fee_val = flat + (perc / 100) * Amount;
    return applied_fee_val;
  }
};
