var initialKey = "/";
var theTerm = null;

$().ready(
		function($) {
			var settings = {
				prompt : 'reflex> ',
				name : 'reflex',
				height : 600,
				outputLimit: 1000,
				enabled : false,
				greetings : 'Reflex console',
				onInit : function(term) {
					theTerm = term;
				}

			};
			// get a session id
			var sessionId;

			$.ajax({
				url : "../web/getREPLSession.rrfx",
				dataType : 'json',
				success : function(data) {
					$("#sessionId").text(data.sessionId);
					sessionId = data.sessionId;

					$('#console').terminal(
							function(command, term) {
								// Pass this onto Reflex
								var vals = {};
								vals['id'] = sessionId;
								vals['line'] = encodeURIComponent(command);
								$.ajax({
									url : "../web/evalREPLSession.rrfx",
									dataType : 'json',
									type : 'POST',
									data : vals,
									success : function(data) {
										if (data.response.length != 0) {
											var realText = "[[b;yellow;]"
													+ data.response + "]";
											term.echo(realText);
										} else if (data.error.length != 0) {
											var realText = "[[b;red;]"
													+ data.error + "]";
											term.echo(realText);
										}

									}
								});
							}, settings);
				}
			});

			$("#tree").dynatree({
				initAjax : {
					url : "../web/snippetTree.rrfx",
					data : {
						"key" : initialKey,
						"mode" : "all"
					}
				},
				onLazyRead : function(node) {
					node.appendAjax({
						url : "../web/snippetTree.rrfx",
						data : {
							"key" : node.data.key, // Optional url arguments
							"mode" : "all"
						}
					});
				},
				onActivate : function(node) {
					if (!node.data.isFolder) {
						$.ajax({
							url : "../web/getSnippet.rrfx?id=" + node.data.key,
							dataType : 'json',
							success : function(data) {
								$("#snippetContent").val(data.content);
								$("#snippetURI").val(node.data.key);
							}
						});

					}
				}
			});

			$("#refresh").on("click", function() {
				$("#tree").dynatree("getTree").reload();
				return false;
			});

			$("#executeButton").on("click", function() {
				// Do something with pasting into the terminal
				theTerm.exec($("#snippetContent").val());
				return false;
			});

			$("#createButton").on("click", function() {
				var uri = $("#snippetURI").val();
				var content = $("#snippetContent").val();
				var vals = {};
				vals['id'] = uri;
				vals['content'] = encodeURIComponent(content);
				$.ajax({
					url : "../web/createSnippet.rrfx",
					dataType : 'json',
					type : 'POST',
					data : vals,
					success : function(data) {
					    $("#tree").dynatree("getTree").reload();
					}
				});
				return false;
			});
		});