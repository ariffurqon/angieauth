myApp.controller('meetingsCtrl', 
	['$scope', 
	'$rootScope', 
	'$firebaseAuth',
	'$firebaseArray',
	'FIREBASE_URL',
	function($scope, $rootScope, $firebaseAuth, $firebaseArray, FIREBASE_URL) {
 		
		var ref = new Firebase(FIREBASE_URL);
		var auth = $firebaseAuth(ref);

		auth.$onAuth(function(authUser) {
			if (authUser) {
				var meetingsRef = new Firebase(FIREBASE_URL + 'users/' + 
					$rootScope.currentUser.$id + '/meetings');
				var meetingsInfo = $firebaseArray(meetingsRef);
				$scope.meetings = meetingsInfo;

				meetingsInfo.$loaded().then(function(data) {
					$rootScope.howManyMeetings = meetingsInfo.length;
				}); // make sure meeting data is loaded

				meetingsInfo.$watch(function(data) {
					$rootScope.howManyMeetings = meetingsInfo.length;
				}); 


				$scope.addMeeting = function() {
					meetingsInfo.$add({
						name: $scope.meetingname,
						date: Firebase.ServerValue.TIMESTAMP
					}).then (function() {
						$scope.meetingname = '';
					}); // promise
				}; // add meeting

				$scope.deleteMeeting = function(key) {
					meetingsInfo.$remove(key);
				}; // delete meeting

			} // user authenticated
		}); // on Auth

 }]); // controller