// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ProcessingSteps {
    struct ProcessingStep {
        string batchId;
        string processorId;
        string stepType;
        uint256 temperature;
        uint256 duration;
        string notes;
        string fileHash;
        uint256 timestamp;
        address submittedBy;
    }
    
    mapping(bytes32 => ProcessingStep) public processingSteps;
    mapping(string => bytes32[]) public batchSteps;
    
    event ProcessingStepAdded(
        bytes32 indexed stepHash,
        string indexed batchId,
        string processorId,
        string stepType,
        uint256 timestamp
    );
    
    event ProcessingStepVerified(
        bytes32 indexed stepHash,
        string indexed batchId,
        address verifiedBy
    );
    
    function addProcessingStep(
        string memory _batchId,
        string memory _processorId,
        string memory _stepType,
        uint256 _temperature,
        uint256 _duration,
        string memory _notes,
        string memory _fileHash
    ) public returns (bytes32) {
        // Create hash of the processing step data
        bytes32 stepHash = keccak256(abi.encodePacked(
            _batchId,
            _processorId,
            _stepType,
            _temperature,
            _duration,
            _notes,
            _fileHash,
            block.timestamp,
            msg.sender
        ));
        
        // Store the processing step
        processingSteps[stepHash] = ProcessingStep({
            batchId: _batchId,
            processorId: _processorId,
            stepType: _stepType,
            temperature: _temperature,
            duration: _duration,
            notes: _notes,
            fileHash: _fileHash,
            timestamp: block.timestamp,
            submittedBy: msg.sender
        });
        
        // Add to batch steps array
        batchSteps[_batchId].push(stepHash);
        
        emit ProcessingStepAdded(stepHash, _batchId, _processorId, _stepType, block.timestamp);
        
        return stepHash;
    }
    
    function getProcessingStep(bytes32 _stepHash) public view returns (
        string memory batchId,
        string memory processorId,
        string memory stepType,
        uint256 temperature,
        uint256 duration,
        string memory notes,
        string memory fileHash,
        uint256 timestamp,
        address submittedBy
    ) {
        ProcessingStep memory step = processingSteps[_stepHash];
        return (
            step.batchId,
            step.processorId,
            step.stepType,
            step.temperature,
            step.duration,
            step.notes,
            step.fileHash,
            step.timestamp,
            step.submittedBy
        );
    }
    
    function getBatchSteps(string memory _batchId) public view returns (bytes32[] memory) {
        return batchSteps[_batchId];
    }
    
    function verifyProcessingStep(bytes32 _stepHash) public {
        require(processingSteps[_stepHash].timestamp > 0, "Processing step does not exist");
        
        ProcessingStep memory step = processingSteps[_stepHash];
        emit ProcessingStepVerified(_stepHash, step.batchId, msg.sender);
    }
    
    function getStepCount(string memory _batchId) public view returns (uint256) {
        return batchSteps[_batchId].length;
    }
}
