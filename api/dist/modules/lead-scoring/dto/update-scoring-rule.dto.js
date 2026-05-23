"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateScoringRuleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_scoring_rule_dto_1 = require("./create-scoring-rule.dto");
class UpdateScoringRuleDto extends (0, mapped_types_1.PartialType)(create_scoring_rule_dto_1.CreateScoringRuleDto) {
}
exports.UpdateScoringRuleDto = UpdateScoringRuleDto;
//# sourceMappingURL=update-scoring-rule.dto.js.map