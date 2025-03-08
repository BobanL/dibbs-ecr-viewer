/**
 * @jest-environment node
 */

import * as extended_database_repo from "@/app/api/services/extended_database_repo";
import {
  buildExtended,
  clearExtended,
  dropExtended,
} from "@/app/api/services/db_schema";

describe("extended_database_repo", () => {
  beforeAll(async () => {
    await buildExtended()
  });

  afterAll(async () => {
    await dropExtended();
  });

  describe("ecr_data", () => {
    const template = {
      eICR_ID: "12345",
      set_id: "12345",
      fhir_reference_link: "http://example.com",
      last_name: "Kenobi",
      first_name: "Obi-Wan",
      birth_date: new Date("2024-12-31T05:00:00.000Z"),
      gender: "Based",
      birth_sex: "Based",
      gender_identity: "Based",
      race: "Star Guy",
      ethnicity: "Star Guy",
      latitude: 0.0,
      longitude: 0.0,
      homelessness_status: "Homeless",
      disabilities: "None",
      tribal_affiliation: "None",
      tribal_enrollment_status: "None",
      current_job_title: "Jedi Master",
      current_job_industry: "Jedi Order",
      usual_occupation: "Jedi Master",
      usual_industry: "Jedi Order",
      preferred_language: "Galactic Basic",
      pregnancy_status: "Not Pregnant",
      rr_id: "12345",
      processing_status: "Processed",
      eicr_version_number: "1.0",
      authoring_date: new Date("2024-12-31T05:00:00.000Z"),
      authoring_provider: "Dr. Droid",
      provider_id: "12345",
      facility_id: "12345",
      facility_name: "Jedi Temple",
      encounter_type: "Checkup",
      encounter_start_date: new Date("2024-12-31T05:00:00.000Z"),
      encounter_end_date: new Date("2024-12-31T05:00:00.000Z"),
      reason_for_visit: "Checkup",
      active_problems: ["Dead"],
      date_created: new Date("2025-01-01"),
    };
    beforeEach(async () => {
      await extended_database_repo.createExtendedEcr(template);
    });

    afterEach(async () => {
      await clearExtended();
    })

    it("should find an ECR with a given eICR_ID", async () => {
      const actual = await extended_database_repo.findExtendedEcrById("12345");
      expect(actual).toEqual({...template, active_problems: "{\"Dead\"}"}); // Needs fix to switch to array from string. Coming soon!
    });

    it("should find all people named General", async () => {
      const actual = await extended_database_repo.findExtendedEcr({ first_name: "Obi-Wan" });
      expect(actual[0]).toEqual({...template, active_problems: "{\"Dead\"}"});
    });

    it("should update patient_name_last of a person with a given id", async () => {
      await extended_database_repo.updateExtendedEcr("12345", {
        last_name: "Grievous",
      });
      const actual = await extended_database_repo.findExtendedEcrById("12345");
      expect(actual?.last_name).toEqual("Grievous");
    });

    it("should create an ECR", async () => {
      await extended_database_repo.createExtendedEcr({...template, eICR_ID: "54321"});
      const actual = await extended_database_repo.findExtendedEcrById("54321");
      expect(actual).toEqual({...template, eICR_ID: "54321", active_problems: "{\"Dead\"}"});
    });

    it("should delete an ECR with a given id", async () => {
      await extended_database_repo.deleteExtendedEcr("12345");
      const actual = await extended_database_repo.findExtendedEcrById("12345");
      expect(actual).toBeUndefined();
    });
  });

  // patient_address
  describe("patient_address", () => {
    const template = {
      uuid: "12345",
      use: "home",
      type: "postal",
      text: "1234 Main St",
      line: ["Apt 2"],
      city: "Coruscant",
      district: "Galactic City",
      state: "Coruscant",
      postal_code: "12345",
      country: "Republic",
      period_start: new Date("2024-12-31T05:00:00.000Z"),
      period_end: new Date("2025-02-06T05:00:00.000Z"),
      eICR_ID: "12345",
    };
    beforeEach(async () => {
      await extended_database_repo.createAddress(template);
    });

    afterEach(async () => {
      await clearExtended();
    })

    it("should find an address with a given uuid", async () => {
      const actual = await extended_database_repo.findAddressById("12345");
      expect(actual).toEqual({...template, line: "{\"Apt 2\"}"}); // Same fix coming soon here
    });

    it("should find all registered addresses within a given city", async () => {
      const actual = await extended_database_repo.findAddress({ city: "Coruscant" });
      expect(actual[0]).toEqual({...template, line: "{\"Apt 2\"}"});
    });

    it("should update the address with a given id", async () => {
      await extended_database_repo.updateAddress("12345", { city: "Mustafar" });
      const actual = await extended_database_repo.findAddressById("12345");
      expect(actual?.city).toEqual("Mustafar");
    });

    it("should create an address", async () => {
      await extended_database_repo.createAddress({...template, uuid: "54321"});
      const actual = await extended_database_repo.findAddressById("54321");
      expect(actual).toEqual({...template, uuid: "54321", line: "{\"Apt 2\"}"});
    });

    it("should delete an address with a given id", async () => {
      await extended_database_repo.deleteAddress("12345");
      const actual = await extended_database_repo.findAddressById("12345");
      expect(actual).toBeUndefined();
    });
  });

  // ecr_labs
  describe("ecr_labs", () => {
    const template = {
      uuid: "12345",
      eICR_ID: "12345",
      test_type: "Dark Magic",
      test_type_code: "12345",
      test_type_system: "Magic",
      test_result_qualitative: "Magic",
      test_result_quantitative: 0,
      test_result_units: "Magic",
      test_result_code: "Magic",
      test_result_code_display: "Magic",
      test_result_code_system: "Magic",
      test_result_interpretation: "Magic",
      test_result_interpretation_code: "Magic",
      test_result_interpretation_system: "Magic",
      test_result_reference_range_low_value: 0,
      test_result_reference_range_low_units: "Magic",
      test_result_reference_range_high_value: 0,
      test_result_reference_range_high_units: "Magic",
      specimen_type: "Magic",
      specimen_collection_date: new Date("2024-12-31T05:00:00.000Z"),
      performing_lab: "Magic",
    };
    beforeEach(async () => {
      await extended_database_repo.createLab(template);
    });

    afterEach(async () => {
      await clearExtended();
    })
    it("should find a lab with a given uuid", async () => {
      const actual = await extended_database_repo.findLabById("12345");
      expect(actual).toEqual(template);
    });

    it("should find all labs with test_type Dark Magic", async () => {
      const actual = await extended_database_repo.findLab({ test_type: "Dark Magic" });
      expect(actual[0]).toEqual(template);
    });

    it("should update the lab with a given id", async () => {
      await extended_database_repo.updateLab("12345", {
        test_result_code: "FAIL",
      });
      const actual = await extended_database_repo.findLabById("12345");
      expect(actual?.test_result_code).toEqual("FAIL");
    });

    it("should create a lab", async () => {
      await extended_database_repo.createLab({...template, uuid: "54321"});
      const actual = await extended_database_repo.findLabById("54321");
      expect(actual).toEqual({...template, uuid: "54321"});
    });


    it("should delete a lab with a given id", async () => {
      await extended_database_repo.deleteLab("12345");
      const actual = await extended_database_repo.findLabById("12345");
      expect(actual).toBeUndefined();
    });
  });

  // ecr_rr_conditions
  describe("ecr_rr_conditions", () => {
    const template = {
      eICR_ID: "12345",
      uuid: "12345",
      condition: "Dark Magic",
    };
    beforeEach(async () => {
      await extended_database_repo.createEcrCondition(template);
    });

    afterEach(async () => {
      await clearExtended();
    })
    it("should find a conditions with a given uuid", async () => {
      const actual = await extended_database_repo.findEcrConditionById("12345");
      expect(actual).toEqual(template);
    });

    it("should find all conditions named Dark Magic", async () => {
      const actual = await extended_database_repo.findEcrCondition({ condition: "Dark Magic" });
      expect(actual[0]).toEqual(template);
    });

    it("should update the condition with a given id", async () => {
      await extended_database_repo.updateEcrCondition("12345", {
        condition: "Extra Dark Magic",
      });
      const actual = await extended_database_repo.findEcrConditionById("12345");
      expect(actual?.condition).toEqual("Extra Dark Magic");
    });

    it("should create a condition", async () => {
      await extended_database_repo.createEcrCondition({
        eICR_ID: "12345",
        uuid: "54321",
        condition: "Dark Magic",
      });
      const actual = await extended_database_repo.findEcrConditionById("54321");
      expect(actual).toEqual({...template, uuid: "54321"});
    });

    it("should delete a condition with a given id", async () => {
      await extended_database_repo.deleteEcrCondition("12345");
      const actual = await extended_database_repo.findEcrConditionById("12345");
      expect(actual).toBeUndefined();
    });
  });

  // ecr_rr_rule_summaries
  describe("ecr_rr_rule_summaries", () => {
    const template = {
      ecr_rr_conditions_id: "12345",
      uuid: "12345",
      rule_summary: "Dark Magic",
    };
    beforeEach(async () => {
      await extended_database_repo.createEcrRule(template);
    });

    afterEach(async () => {
      await clearExtended();
    })
    it("should find a rule summary with a given uuid", async () => {
      const actual = await extended_database_repo.findEcrRuleById("12345");
      expect(actual).toEqual(template);
    });

    it("should find all rule summaries named Dark Magic", async () => {
      const actual = await extended_database_repo.findEcrRule({ rule_summary: "Dark Magic" });
      expect(actual[0]).toEqual(template);
    });

    it("should update the rule summary with a given id", async () => {
      await extended_database_repo.updateEcrRule("12345", {
        rule_summary: "Extra Dark Magic",
      });
      const actual = await extended_database_repo.findEcrRuleById("12345");
      expect(actual?.rule_summary).toEqual("Extra Dark Magic");
    });

    it("should create a rule summary", async () => {
      await extended_database_repo.createEcrRule({
        ecr_rr_conditions_id: "12345",
        uuid: "54321",
        rule_summary: "Dark Magic",
      });
      const actual = await extended_database_repo.findEcrRuleById("54321");
      expect(actual).toEqual({...template, uuid: "54321"});
    });

    it("should delete a rule summary with a given id", async () => {
      await extended_database_repo.deleteEcrRule("12345");
      const actual = await extended_database_repo.findEcrRuleById("12345");
      expect(actual).toBeUndefined();
    });
  });
});
